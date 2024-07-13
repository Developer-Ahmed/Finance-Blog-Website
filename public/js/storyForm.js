// This code is not neccesary

function handleImageUploading() { 
  var image = "";

  let selectImageButton = document.getElementById("select-image-button");
  let preview = document.getElementById("preview"); 

  if (selectImageButton.files && selectImageButton.files[0]) {
    var reader = new FileReader();
    reader.addEventListener("load", () => {
      image = reader.result;
      preview.setAttribute("src", image);
    });
    reader.readAsDataURL(selectImageButton.files[0]);
  } else if(err) {
    console.log(err);
  }
}


const addButton = document.querySelector(".add-img-or-txt");

const popupForAddButton = document.querySelector(".popup-img-txt");


addButton.addEventListener("click", handleClickOnAddButton);

function handleClickOnAddButton() {
  // add the 'hidden' class to add button 
  addButton.classList.add("hidden");
  // remove 'Hidden' class from popup
  popupForAddButton.classList.remove("hidden");
}

// close popup 
const closePopup = document.querySelector(".popup-cancel");

closePopup.addEventListener("click", handleClickOnClosePopup);

function handleClickOnClosePopup() {
  // add the 'hidden' class to add button 
  addButton.classList.remove("hidden");
  // remove 'Hidden' class from popup
  popupForAddButton.classList.add("hidden");
}

const popupTextbox = document.querySelector(".popup-textbox");

popupTextbox.addEventListener("click", AddATextBox);

// function to add a textbox
function AddATextBox() {
  const textboxTemplate = document.querySelector(".textbox-template");
  const clone = textboxTemplate.content.cloneNode(true);

  const imgTxtDiv = document.querySelector(".images-and-textboxes");
  imgTxtDiv.appendChild(clone);
}

const popupImage = document.querySelector(".popup-image");

popupImage.addEventListener("click", AddAnImage);

// function to add an image
function AddAnImage() {
  const imageTemplate = document.querySelector(".image-template");
  const clone = imageTemplate.content.cloneNode(true);

  const imgTxtDiv = document.querySelector(".images-and-textboxes");
  imgTxtDiv.appendChild(clone);

  changeClassName();
}

function changeClassName() {
  let imageTemplate = document.querySelector(".image-template")
  let selectImageButton = document.getElementById("select-image-button");
  let preview = document.getElementById("preview"); 

  const previews = document.querySelectorAll("#preview");

  const selectImageButtons = document.querySelectorAll("#select-image-button");

  console.log(selectImageButtons.length, previews.length, selectImageButtons, previews);

  for (let index = 0; index <= previews.length; index++) {
    if (previews[index]) {
      previews[index].setAttribute("id", `preview${index} preview`);

      selectImageButtons[index].setAttribute("id", `select-image-button${index} select-image-button`);

      console.log(previews[index], selectImageButtons[index], index);

    }
  }
}






