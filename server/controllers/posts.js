function create(req, res) {
  const db = req.app.get("db");

  const { userId, content } = req.body;

  db.posts // heres the new stuff, using massive to actually query the database.
    .save({
      userId,
      content
    })
    .then(post => res.status(201).json(post)) // returns a promise so we need to use .then
    .catch(err => {
      console.error(err); // if something happens we handle the error as well.
      res.status(500).end();
    });
}

function list(req, res) {
  const db = req.app.get("db");

  db.posts
    .find()
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}

function getById(req, res) {
  const db = req.app.get('db')
    db.posts
      .find(req.params.id)
	  .then(post => {
	  	db.comments
		.find({postId:req.params.id})
        .then(comment => res.status(200).json({post,comment}))
		.catch(err => {
			console.error(err)
            res.status(500).end()
		})
	  })
	  .catch(err => {
	  	console.log(err)
	  	res.status(500).end()
	  })
}

function updateById(req,res){
	const db = req.app.get('db')
	const { content} = req.body
	db.posts
	.update({
		id:req.params.id
	},{
		content:content
	})
	.then(post => res.status(201).send(post))
	.catch(err => {
		console.err(err)
		res.status(500).end()
	})
} 


module.exports = {
  create,
  list,
  getById,
  updateById,
};
