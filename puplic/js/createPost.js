var image=""
function handleFormSubmission(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const tag = document.getElementById("tag").value;

    const formData = {
        title,
        body,
        tag,
        image
    };

    try {
        fetch("/publish", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(formData)
        }).then(response => {
            if (response.ok) {
                window.location.href = '/blogs';
            } else {
                console.error("Form submission failed");
            }
        });
    } catch (error) {
        console.error(error);
    }

}
function encodeImageFileAsURL() {

    var filesSelected = document.getElementById("inputFileToLoad").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];

      var fileReader = new FileReader();

      fileReader.onload = function(fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result; // <--- data: base64

        image= srcData;
      }
      fileReader.readAsDataURL(fileToLoad);
    }
}