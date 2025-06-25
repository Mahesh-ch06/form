document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const formContainer = document.getElementById("form-container");
  const thankYou = document.getElementById("thank-you-message");

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
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        status.innerHTML = "";
        form.reset();
        formContainer.classList.add("hidden");
        thankYou.classList.remove("hidden");
      } else {
        status.innerHTML = result.message;
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
