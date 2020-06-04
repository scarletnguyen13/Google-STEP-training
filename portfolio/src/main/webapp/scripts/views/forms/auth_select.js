import { createAuthForm } from './forms.js';

const renderForm = (value) => {
  const form = createAuthForm(value);
  const formContainer = document.getElementById('form-container');
  formContainer.removeChild(formContainer.lastChild);
  formContainer.appendChild(form);
}

const createAuthSelect = () => {
  const authSelect = document.createElement('select');
  authSelect.id = 'auth-select';
  const options =  ['Login', 'Signup'];
  options.map(opt => {
    const option = document.createElement('option');
    option.innerHTML = opt;
    authSelect.appendChild(option);
  })
  authSelect.value = options[0];
  authSelect.onchange = function() {
    renderForm(this.value);
  }
  return authSelect;
}

export { createAuthSelect };