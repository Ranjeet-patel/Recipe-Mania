require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const Contact = require('../models/Contact.js');

/**
 * GET /
 * Homepage 
*/
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const Gujrati = await Recipe.find({ 'category': 'Gujrati' }).limit(limitNumber);
    const Rajasthani = await Recipe.find({ 'category': 'Rajasthani' }).limit(limitNumber);
    const spicy = await Recipe.find({ 'category': 'spicy' }).limit(limitNumber);
    const indian = await Recipe.find({ 'category': 'indian' }).limit(limitNumber)

    const food = { latest, Gujrati, Rajasthani, spicy ,indian};

    res.render('index', { title: 'Recipe Mania - Home', categories, food });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Recipe Mania - Categoreis', categories });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Recipe Mania - Categoreis', categoryById });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * GET /recipe/:id
 * Recipe 
*/
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'Recipe Mania - Recipe', recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * POST /search
 * Search 
*/
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Recipe Mania - Search', recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }

}

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Recipe Mania - Explore Latest', recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}



/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Recipe Mania - Explore Latest', recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Recipe Mania - Submit Recipe', infoErrorsObj, infoSubmitObj });
}
// About
exports.aboutpage = async (req, res) => {
  res.render('about', { title: 'Recipe Mania - About' });
}
// Contact 
exports.contactpage = async (req, res) => {
  const infoContactErrorsObj = req.flash('infoContactErrors');
  const infoContactObj = req.flash('infoContact');
  res.render('contact', { title: 'Recipe Mania - Contact', infoContactErrorsObj, infoContactObj });
}

exports.contactpagePost = async (req, res) => {
  try {
    const newcontact = new Contact({
      name: req.body.name,
      subject: req.body.subject,
      email: req.body.email,
      number: req.body.number,
      message: req.body.message,
    });

    await newcontact.save();

    req.flash('infoContact', 'contact message has been sumited.')
    res.redirect('/contact');
  } catch (error) {
    // res.json(error);
    req.flash('infoContactErrors', error);
    res.redirect('/contact');
  }
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async (req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });

    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}






// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();


/**
 * Dummy Data Example
*/

// async function insertDymmyCategoryData() {
//   try {
//     await Category.insertMany([
//       {
//         "name": "Gujrati",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "Rajasthani",
//         "image": "american-food.jpg"
//       },
//       {
//         "name": "spicy",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Sweet",
//         "image": "mexican-food.jpg"
//       },
//       {
//         "name": "indian",
//         "image": "indian-food.jpg"
//       },

//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();


// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Rajasthani", 
//         "image": "southern-friend-chicken.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Rajasthani", 
//         "image": "southern-friend-chicken.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();

