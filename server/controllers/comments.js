function create(req, res) {
  const db = req.app.get("db");

  const { userId, comment } = req.body;

  db.comments // heres the new stuff, using massive to actually query the database.
    .save({
      userId,
      postId:req.params.postid,
      comment
    })
    .then(comment => res.status(201).json(comment)) // returns a promise so we need to use .then
    .catch(err => {
      console.error(err); // if something happens we handle the error as well.
      res.status(500).end();
    });
}

function updateById(req,res){
	const db = req.app.get('db')
	const { comment,userId } = req.body
	db.comments
	.update({
    postId:req.params.post_id,
		id:req.params.comment_id
	},{
    userId:userId,
		comment:comment
	})
	.then(post => res.status(201).send(post))
	.catch(err => {
		console.err(err)
		res.status(500).end()
	})
}

module.exports = {
  create,updateById
};
