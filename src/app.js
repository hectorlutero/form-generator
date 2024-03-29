
const app = document.querySelector("#root");
const formContainer = document.querySelector("#form-container");
const initialFormCreator = document.querySelector("#initialForm");

class FormGenerator {
    constructor({
        id = "form",
        name = "form",
        method = "post",
        action = "http://localhost:8080/api/v1",
        enctype = "multipart/form-data",
        formClass = "form",
        role = "form",
        title = "Form Title"
    } = {}) {
        this.form = document.createElement("form");
        this.form.setAttribute("id", id);
        this.form.setAttribute("name", name);
        this.form.setAttribute("method", method);
        this.form.setAttribute("action", action);
        this.form.setAttribute("enctype", enctype);
        this.form.setAttribute("class", formClass);
        this.form.setAttribute("role", role);
        this.inputTemplates = {};
        this.countries = [];
        this.title = title;
    }


    async populateInputTemplates() {
        const res = await fetch("./utils/formInputTemplates.json");
        const inputTemplates = await res.json();
        this.inputTemplates = inputTemplates;
    }

    async populateCountries() {
        const res = await fetch("./utils/countries.json");
        const countries = await res.json();
        this.countries = countries.countries;
    }

    createInput({ name, type, placeholder = '', required = false, value = '', options = [] }) {
        let input;
        let label = document.createElement('label');
        switch (type) {
            case "text":
                input = document.createElement("input");
                input.setAttribute("type", "text");
                break;
            case "checkbox":
                label.innerText = placeholder
                input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                break;
            case "radio":
                label.innerText = placeholder
                break;
            case "password":
                input = document.createElement("input");
                input.setAttribute("type", "password");
                break;
            case "email":
                input = document.createElement("input");
                input.setAttribute("type", "email");
                break;
            case "select":
                input = document.createElement("select");
                break;
            case "textarea":
                input = document.createElement("textarea");
                break;
            case "file":
                label.innerText = placeholder
                input = document.createElement("input");
                input.setAttribute("type", "file");
                break;
            case "date":
                label.innerText = placeholder
                input = document.createElement("input");
                input.setAttribute("type", "date");
                break;
            case "submit":
                input = document.createElement("input");
                input.setAttribute("type", "submit");
                break;
            default:
                input = document.createElement("input");
                break;
        }

        if (required)
            input.setAttribute("required", "required");

        if (type === 'radio' || type === 'checkbox') {
            for (let option of options) {
                let radioInputGroup = document.createElement("div");
                radioInputGroup.setAttribute("class", "radio-check-container");
                let radioLabel = document.createElement("label");
                radioLabel.setAttribute('for', option.value);
                radioLabel.innerText = option.text;
                input = document.createElement("input");
                input.setAttribute("type", type);
                input.setAttribute("name", name);
                input.setAttribute("value", option.value);
                input.setAttribute("id", option.value);
                input.setAttribute("class", "form-control");
                radioInputGroup.appendChild(input);
                radioInputGroup.appendChild(radioLabel);
                label.appendChild(radioInputGroup);
            }
            label.setAttribute('class', 'radio-inputs')
            return label
        }

        if (type === "select") {
            for (let option of options) {
                let optionElement = document.createElement("option");
                optionElement.setAttribute("value", option.value);
                optionElement.innerHTML = option.text;
                input.appendChild(optionElement);
            }
        }


        label.setAttribute('for', name);
        if (type === "submit")
            input.innerText = value;
        else
            input.setAttribute('value', value);
        input.setAttribute("name", name);
        input.setAttribute("placeholder", placeholder);
        input.setAttribute("class", "form-control");

        label.appendChild(input);

        return label


    }

    generateInputs(inputs) {
        let div = document.createElement("div");
        div.setAttribute("class", "inputs");
        for (let input of inputs) {
            div.appendChild(this.createInput(input));
        }
        return div;
    }

    async createForm(pattern, options = {}) {
        let form = this.form;
        let header = document.createElement("h2");
        console.log(this.title)
        header.innerText = this.title;
        form.appendChild(header);
        let inputs;
        let formTemplate;
        await this.populateInputTemplates();
        await this.populateCountries();
        this.inputTemplates.country.options = this.countries;
        switch (pattern) {
            case "signup":
                this.inputTemplates.submit.value = "Sign up",

                    formTemplate = [
                        this.inputTemplates.firstName,
                        this.inputTemplates.lastName,
                        this.inputTemplates.email,
                        this.inputTemplates.gender,
                        this.inputTemplates.birthdate,
                        this.inputTemplates.password,
                        this.inputTemplates.confirmPassword,
                        this.inputTemplates.country,
                        this.inputTemplates.submit
                    ]

                form.appendChild(this.generateInputs(formTemplate));

                break;
            case "login":
                this.inputTemplates.submit.value = "Sign in",

                    formTemplate = [
                        this.inputTemplates.email,
                        this.inputTemplates.password,
                        this.inputTemplates.submit

                    ]
                form.appendChild(this.generateInputs(formTemplate));
                break;
            case "reset-password":
                this.inputTemplates.submit.value = "Reset Password",
                    formTemplate = [
                        this.inputTemplates.newPassword,
                        this.inputTemplates.confirmPassword,
                        this.inputTemplates.submit
                    ]
                form.appendChild(this.generateInputs(formTemplate));
                break;
            case "profile":
                this.inputTemplates.submit.value = "Update Profile",

                    formTemplate = [
                        this.inputTemplates.firstName,
                        this.inputTemplates.lastName,
                        this.inputTemplates.email,
                        this.inputTemplates.gender,
                        this.inputTemplates.birthdate,
                        this.inputTemplates.country,
                        this.inputTemplates.submit
                    ]
                form.appendChild(this.generateInputs(formTemplate));
                break;
            case "checkout":
                this.inputTemplates.submit.value = "Checkout",

                    formTemplate = [
                        this.inputTemplates.firstName,
                        this.inputTemplates.lastName,
                        this.inputTemplates.email,
                        this.inputTemplates.gender,
                        this.inputTemplates.birthdate,
                        this.inputTemplates.country,
                        this.inputTemplates.submit
                    ]
                form.appendChild(this.generateInputs(formTemplate));
                break;
            case "custom":
                if (Object.keys(options).length === 0) {
                    let paragraph = document.createElement("p");
                    paragraph.innerText = "You need to provide the form";
                    form.appendChild(paragraph);
                    break;
                }

                if (Object.keys(options).length > 0 && options.formInputs.length === 0) {
                    let paragraph = document.createElement("p");
                    paragraph.innerText = "You need to provide the form inputs";
                    form.appendChild(paragraph);
                    break;
                }

                form.appendChild(this.generateInputs(options.formInputs));
                break;
            default:
                break;
        }

        formContainer.innerHTML = form.outerHTML;
    }
}


initialFormCreator.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(initialFormCreator);
    const formName = document.querySelector("#formName").value;
    const selectedOption = document.querySelector("#formTemplate").value;
    const form = new FormGenerator({
        title: formName
    });

    form.createForm(selectedOption)
});


