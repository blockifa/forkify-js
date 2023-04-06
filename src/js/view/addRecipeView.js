import icons from 'url:../../img/icons.svg'
import view from './view.js'

class AddRecipeView extends view {
   
    _message = 'Recipe was successfuly uploade :)'
    _parentElement = document.querySelector('.upload')
    _btnOpen = document.querySelector('.nav__btn--add-recipe')
    _overly = document.querySelector('.overlay')
    _window = document.querySelector('.add-recipe-window')
    _btnClose = document.querySelector('.btn--close-modal')

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerCloseWindow()
    }

    toggleWindow(){
        this._overly.classList.toggle('hidden')
        this._window.classList.toggle('hidden')
    }

    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this))
    }

    _addHandlerCloseWindow(){
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this))
        this._overly.addEventListener('click', this.toggleWindow.bind(this))

    }

    addHadlerUpdate(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault()
            const dataArr = [...new FormData(this)]
            const data = Object.fromEntries(dataArr)
            handler(data)
        })
    }

    _generateMarkup(){

    }
}

export default new AddRecipeView()