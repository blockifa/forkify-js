import * as model from './madel.js'
import {MODAL_CLOSE_SEC} from './config'

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { async } from 'regenerator-runtime';

import recipeView from './view/recipeView.js';
import searchView from './view/searchView'
import resultsView from './view/resultsView.js';
import paginatiionView from './view/paginationView.js'
import bookMarksView from './view/bookMarksView.js';
import addRecipeView from './view/addRecipeView'


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if(module.hot){
  module.hot.accept()
}

const controlRecipes = async function () {
  try {

    // Get Id
    const id = window.location.hash.slice(1)
    if(!id) return

    // 1) Update result view to mark selected search result
    resultsView.update(model.getSearchResultPage())
    
    // 2) Update bookmarks view 
    bookMarksView.update(model.state.bookmarks)

    // 3) render Spiner
    recipeView.renderSpiner()
    
    // 4) Loading Recipe
    await model.loadRecipe(id)
    
    // 5) Rendering Recipe
    // const recipeView = new recipeView(model.state.recipe)
    recipeView.render(model.state.recipe)
    

  } catch (err) {
    recipeView.renderError()
  }
}

const controlSearchResults = async function(){
  try{
    // render Spiner
    resultsView.renderSpiner()

    // 1) Get Search Query
    const query  = searchView.getQuery()
    if(!query) return


    // 2) Load Search Result
    await model.loadSearchResults(query)  
    
    // 3) Rendering Results
    resultsView.render(model.getSearchResultPage())

    // 4) Render initial pagination buttons
    paginatiionView.render(model.state.search)

  }catch(err){
    // resultsView.renderError()
  }
}

const controlPagination = function(goToPage){

  // 1) Rendering New Results
  resultsView.render(model.getSearchResultPage(goToPage))

  // 2) Render New Pagination Buttons
  paginatiionView.render(model.state.search)
}

const controlServings = function(newServings){

  // 1) Update the recipe serving (in state)
  model.updateServings(newServings)

  // 2) Update the recipe view
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function(){

  // 1) Add/Remove Bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  // 2) Update recipe view
  recipeView.update(model.state.recipe)

  // 3) Render bookmarks
  bookMarksView.render(model.state.bookmarks)
  
}

const controlBookmarks = function(){
  bookMarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try{
    // Show loading spinner
    addRecipeView.renderSpiner()

    // Uplaod the new recipe data
    await model.uploadRecipe(newRecipe)

    // Render recipe
    recipeView.render(model.state.recipe)

    // Success message
    addRecipeView.renderMessage()

    // Render bookmark view
    bookMarksView.render(model.state.bookmarks)

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // Close form window
    setTimeout(function() {
      addRecipeView.toggleWindow()      
    }, MODAL_CLOSE_SEC * 1000);

  }catch(err){
    addRecipeView.renderError(err.message)
  }
}

const init = function(){
  bookMarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  searchView.addHandlerSearch(controlSearchResults)
  paginatiionView.addHandlerClick(controlPagination)
  addRecipeView.addHadlerUpdate(controlAddRecipe)
  console.log('welcome!')
}
init()