const router = require("express").Router();
const Offre = require("../models/offre");
const entreprise = require("../models/entreprise");




 /* 

router.post("/entreprise/:_identreprise", async (req, res) => {
  try {
    let newOffre = new Offre({
      nom: req.body.nom
    });
    await Offre.findByIdAndUpdate(
      req.params._identreprise,
      {
        $addToSet: { mesannonces: newOffre._idOffre },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
        else res.send(docs);
      }
    );
    newOffre.save()
    newCandidastagiaire.save().then( (newCandidastagiaire) =>{
       res.send(newCandidastagiaire);
     }) 
  }

  catch (err) {
    return res.status(400).send(err);
  }
});
module.exports = router;*/


//CREATE

 router.post("/entreprise", async (req, res) => {
  const newOffre = new Offre(req.body);
  try {
    const savedOffre = await newOffre.save();
    res.status(201).json(savedOffre);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
//UPDATE

router.put("/entreprise/annonce/:id", async (req, res) => {
  try {
    const updatedOffre = await Offre.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOffre);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE

router.delete("/entreprise/annonce/:id", async (req, res) => {
  try {
    await Offre.findByIdAndDelete(req.params.id);
    res.status(200).json("The internship offer has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET

router.get("/find/:id", async (req, res) => {
  try {
    const offre = await Offre.findById(req.params.id);
    res.status(200).json(offre);
  } catch (err) {
    res.status(500).json(err);
  }
});



//GET ALL

router.get("/find", async (req, res) => {
  try {
    const offres = await Offre.find();
    res.status(200).json(offres.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});
// serach



router.get("/users/search", async (req, res) => {
  try {
    {
      const nom = req.query.nom;
      Offre.find({'nom': nom}).then((search) => {
        console.log(search);
        res.send(search)
      });
    }
  }
  catch (err) {
    res.status(500).json(err);
  }
});


// find users who apply 
/* app.get('/entreprise/:offre_id', (req,res)=>{
  const offre_id = req.params.offre_id ; 
  Offre.find({_id:offre._id}).then((doc)=>{
  
  res.send(doc) ; 
  
  }).catch((err)=>{console.log(err);})
  })
 */





router.get("/search-technologies-type", async (req, res) => {
  let typeoffQuery = req.query.typeoff;
  let technologiesQuery = req.query.technologies;
  let offre = [];
  try {
    if (typeoffQuery) {
      if (technologiesQuery) {
        offre = await Offre.aggregate([
          { $sample: { size: 10 } },
          { $match: { typeoff: typeoffQuery, technologies: technologiesQuery } },
        ]);
      } else {
        offre = await Offre.aggregate([
          { $sample: { size: 10 } },
          { $match: { typeoff: typeoffQuery } },
        ]);
      }
    } else {
      offre = await Offre.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(offre);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/search-date-region", async (req, res) => {
  let regionQuery = req.query.region;
  let dateQuery = req.query.date;
  let offre = [];
  try {
    if (regionQuery) {
      if (dateQuery) {
        offre = await Offre.aggregate([
          { $sample: { size: 10 } },
          { $match: { region: regionQuery, timestamps: dateQuery } },
        ]);
      } else {
        offre = await Offre.aggregate([
          { $sample: { size: 10 } },
          { $match: { region: regionQuery } },
        ]);
      }
    } else {
      offre = await Offre.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(offre);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;