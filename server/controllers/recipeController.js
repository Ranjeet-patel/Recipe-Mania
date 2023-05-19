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

    const food = { latest, Gujrati, Rajasthani, spicy, indian };

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


async function insertDymmyRecipeData() {
  try {
    await Recipe.insertMany([
      {
        "name": "Samosa",
        "description": "Fried or baked pastry with savory filling, such as spiced potatoes, onions, peas, and lentils.",
        "email": "user2@example.com",
        "ingredients": ["potatoes", "onions", "peas", "lentils", "flour", "ghee", "spices"],
        "category": "indian",
        "image": "https://www.example.com/images/samosa.jpg"
      },
      {
        "name": "Beef Stroganoff",
        "description": "A Russian dish of sautéed pieces of beef in a sour cream-based sauce, served over egg noodles.",
        "email": "user2@example.com",
        "ingredients": ["beef", "onions", "mushrooms", "sour cream", "egg noodles"],
        "category": "spicy",
        "image": "https://www.example.com/images/beef-stroganoff.jpg"
      },
      {
        "name": "Chicken Tikka Masala",
        "description": "A popular Indian dish of marinated chicken pieces that are grilled and then simmered in a creamy tomato sauce.",
        "email": "user1@example.com",
        "ingredients": ["chicken", "yogurt", "spices", "tomato", "cream"],
        "category": "indian",
        "image": "https://www.example.com/images/chicken-tikka-masala.jpg"
      },
      {
        "name": "Pesto Pasta",
        "description": "A simple pasta dish made with a sauce of crushed basil, pine nuts, garlic, Parmesan cheese, and olive oil.",
        "email": "user2@example.com",
        "ingredients": ["pasta", "basil", "pine nuts", "garlic", "Parmesan cheese", "olive oil"],
        "category": "italian",
        "image": "https://www.example.com/images/pesto-pasta.jpg"
      },
      {
        "name": "Miso Soup",
        "description": "A Japanese soup made with miso paste, dashi broth, and ingredients such as tofu, seaweed, and green onions.",
        "email": "user1@example.com",
        "ingredients": ["miso paste", "dashi broth", "tofu", "seaweed", "green onions"],
        "category": "spicy",
        "image": "https://www.example.com/images/miso-soup.jpg"
      },
      {
        "name": "Palak Paneer",
        "description": "A delicious Indian dish made with spinach and cottage cheese",
        "email": "john@example.com",
        "ingredients": ["spinach", "paneer", "onion", "tomato", "garlic", "ginger", "spices"],
        "category": "indian",
        "image": "https://www.example.com/images/palak-paneer.jpg"
      },
      {
        "name": "Rajma Chawal",
        "description": "A popular Punjabi dish made with kidney beans and rice",
        "email": "jane@example.com",
        "ingredients": ["kidney beans", "rice", "onion", "tomato", "garlic", "ginger", "spices"],
        "category": "indian",
        "image": "https://www.example.com/images/rajma-chawal.jpg"
      },
      {
        "name": "Chana Masala",
        "description": "A spicy and tangy chickpea dish from the North Indian cuisine",
        "email": "john@example.com",
        "ingredients": ["chickpeas", "onion", "tomato", "garlic", "ginger", "spices"],
        "category": "indian",
        "image": "https://www.example.com/images/chana-masala.jpg"
      },
      {
        "name": "Samosa",
        "description": "A popular Indian snack filled with spiced potatoes and peas",
        "email": "jane@example.com",
        "ingredients": ["potatoes", "peas", "flour", "spices"],
        "category": "indian",
        "image": "https://www.example.com/images/samosa.jpg"
      },
      {
        "name": "Pav Bhaji",
        "description": "A popular Mumbai street food made with spiced mashed vegetables and bread",
        "email": "john@example.com",
        "ingredients": ["potatoes", "cauliflower", "carrots", "peas", "onion", "tomato", "garlic", "ginger", "spices"],
        "category": "indian",
        "image": "https://www.example.com/images/pav-bhaji.jpg"
      },
      {
        "name": "Butter Chicken",
        "description": "A popular Punjabi dish made with chicken in a creamy tomato-based sauce",
        "email": "jane@example.com",
        "ingredients": ["chicken", "butter", "cream", "tomato", "garlic", "ginger", "spices"],
        "category": "indian",
        "image": "https://www.example.com/images/butter-chicken.jpg"
      },
      {
        "name": "Masala Chai",
        "description": "A spicy and aromatic Indian tea made with milk, tea leaves, and spices",
        "email": "john@example.com",
        "ingredients": ["milk", "tea leaves", "cardamom", "cinnamon", "ginger", "cloves"],
        "category": "indian",
        "image": "https://www.example.com/images/masala-chai.jpg"
      },
      {
        "name": "Paneer Butter Masala",
        "description": "A popular North Indian dish made with paneer in a buttery and creamy tomato-based gravy.",
        "email": "john.doe@example.com",
        "ingredients": ["paneer", "tomatoes", "onions", "butter", "cream", "spices"],
        "category": "indian",
        "image": "https://example.com/images/paneer-butter-masala.jpg"
      },
      {
        "name": "Beef Stroganoff",
        "description": "A classic Russian dish made with beef in a sour cream sauce, served over egg noodles.",
        "email": "jane.doe@example.com",
        "ingredients": ["beef", "onions", "mushrooms", "sour cream", "egg noodles", "spices"],
        "category": "spicy",
        "image": "https://example.com/images/beef-stroganoff.jpg"
      },
      {
        "name": "Tandoori Chicken",
        "description": "A popular Indian dish made with chicken marinated in yogurt and spices, cooked in a tandoor oven.",
        "email": "john.doe@example.com",
        "ingredients": ["chicken", "yogurt", "spices", "lemon juice", "garlic", "ginger"],
        "category": "indian",
        "image": "https://example.com/images/tandoori-chicken.jpg"
      },
      {
        "name": "Lamb Curry",
        "description": "A spicy Indian dish made with lamb cooked in a tomato-based gravy with aromatic spices.",
        "email": "jane.doe@example.com",
        "ingredients": ["lamb", "tomatoes", "onions", "spices", "yogurt", "coriander"],
        "category": "spicy",
        "image": "https://example.com/images/lamb-curry.jpg"
      },
      {
        "name": "Fish and Chips",
        "description": "A classic British dish made with battered fish and thick-cut fries, served with tartar sauce.",
        "email": "john.doe@example.com",
        "ingredients": ["fish", "potatoes", "flour", "beer", "lemon juice", "mayonnaise"],
        "category": "spicy",
        "image": "https://example.com/images/fish-and-chips.jpg"
      },
      {
        "name": "Pad Thai",
        "description": "A popular Thai dish made with rice noodles stir-fried with shrimp, tofu, egg, and bean sprouts.",
        "email": "jane.doe@example.com",
        "ingredients": ["rice noodles", "shrimp", "tofu", "bean sprouts", "eggs", "peanuts"],
        "category": "spicy",
        "image": "https://example.com/images/pad-thai.jpg"
      },
      {
        "name": "Sushi Rolls",
        "description": "A Japanese dish made with sushi rice and various fillings, rolled in sheets of seaweed.",
        "email": "john.doe@example.com",
        "ingredients": ["sushi rice", "seaweed", "avocado", "cucumber", "crab meat", "wasabi"],
        "category": "spicy",
        "image": "https://example.com/images/sushi-rolls.jpg"
      },]);
  } catch (error) {
    console.log('err', + error)
  }
}

insertDymmyRecipeData();

