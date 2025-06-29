document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const formContainer = document.getElementById("form-container");
  const thankYou = document.getElementById("thank-you-message");
  const purposeSelect = document.getElementById("purpose");
  const campusConnectSection = document.getElementById("campusconnect-section");
  const fileUploadArea = document.getElementById("file-upload-area");
  const fileInput = document.getElementById("resume");
  const uploadContent = document.getElementById("upload-content");
  const fileInfo = document.getElementById("file-info");
  const fileName = document.getElementById("file-name");
  const removeFileBtn = document.getElementById("remove-file");

  // Show/hide CampusConnect section based on purpose selection
  purposeSelect.addEventListener("change", function () {
    if (this.value === "CampusConnect") {
      campusConnectSection.classList.remove("hidden");
      campusConnectSection.classList.add("slide-down");
      
      // Make CampusConnect fields required
      document.getElementById("skills").required = true;
      document.getElementById("experience").required = true;
      document.getElementById("contribution").required = true;
      document.getElementById("availability").required = true;
      document.getElementById("resume").required = true;
    } else {
      campusConnectSection.classList.add("hidden");
      
      // Remove required attribute from CampusConnect fields
      document.getElementById("skills").required = false;
      document.getElementById("experience").required = false;
      document.getElementById("contribution").required = false;
      document.getElementById("availability").required = false;
      document.getElementById("resume").required = false;
    }
  });

  // File upload handling
  fileUploadArea.addEventListener("click", () => fileInput.click());

  fileUploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileUploadArea.classList.add("dragover");
  });

  fileUploadArea.addEventListener("dragleave", () => {
    fileUploadArea.classList.remove("dragover");
  });

  fileUploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove("dragover");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  });

  removeFileBtn.addEventListener("click", () => {
    fileInput.value = "";
    uploadContent.classList.remove("hidden");
    fileInfo.classList.add("hidden");
  });

  function handleFileSelection(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, DOC, or DOCX file.");
      return;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 5MB.");
      return;
    }

    fileName.textContent = file.name;
    uploadContent.classList.add("hidden");
    fileInfo.classList.remove("hidden");
  }

  const validateField = (field) => {
    const errorElement = field.nextElementSibling;
    let isValid = true;

    errorElement.classList.add("hidden");
    field.classList.remove("border-red-400");

    if (field.required && !field.value.trim()) {
      errorElement.classList.remove("hidden");
      field.classList.add("border-red-400");
      isValid = false;
    }

    if (field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        errorElement.textContent = "Please enter a valid email.";
        errorElement.classList.remove("hidden");
        field.classList.add("border-red-400");
        isValid = false;
      }
    }

    if (field.type === "file" && field.required && !field.files.length) {
      errorElement.classList.remove("hidden");
      field.classList.add("border-red-400");
      isValid = false;
    }

    return isValid;
  };

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;
    requiredFields.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      status.innerHTML = "Please correct the errors above.";
      status.classList.add("text-red-400");
      return;
    }

    status.innerHTML = "Please wait...";
    status.classList.remove("text-red-400", "text-green-400");

    const formData = new FormData(form);

    try {
      // Using Formspree endpoint - replace YOUR_FORM_ID with actual Formspree form ID
      const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        status.innerHTML = "";
        form.reset();
        formContainer.classList.add("hidden");
        thankYou.classList.remove("hidden");
        
        // Reset file upload area
        uploadContent.classList.remove("hidden");
        fileInfo.classList.add("hidden");
        
        // Hide CampusConnect section
        campusConnectSection.classList.add("hidden");
      } else {
        const data = await response.json();
        if (data.errors) {
          status.innerHTML = data.errors.map(error => error.message).join(", ");
        } else {
          status.innerHTML = "Oops! There was a problem submitting your form";
        }
        status.classList.add("text-red-400");
      }
    } catch (err) {
      console.error(err);
      status.innerHTML = "Something went wrong!";
      status.classList.add("text-red-400");
    }

    setTimeout(() => {
      status.innerHTML = "";
    }, 4000);
  });

  form.querySelectorAll("[required]").forEach((field) =>
    field.addEventListener("blur", () => validateField(field))
  );
});