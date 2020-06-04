import { convertNewLineToBreakTag } from '../../helpers.js';

const createInput = (value) => {
  const input = document.createElement('input');
  const props = {
    id: value.toLowerCase(),
    name: value.toLowerCase(),
    className: 'comment-input',
    type: value.toLowerCase(),
    placeholder: value,
    required: true
  }
  Object.assign(input, props);
  return input;
}

const createTextarea = () => {
  const textarea = document.createElement('textarea');
  const props = {
    className: 'comment-input',
    id: 'comment-textarea',
    name: 'comment',
    placeholder: 'Type something...',
    rows: 3,
    required: true
  }
  Object.assign(textarea, props);
  return textarea;
}

const createButton = (value) => {
  const sendButton = document.createElement('input');
  const props = {
    id: value.toLowerCase(),
    className: 'comment-button', 
    type: 'submit', 
    value
  }
  Object.assign(sendButton, props);
  return sendButton;
}

const displayError = (message) => {
  const authForm = document.getElementById('auth-form');

  const oldMessage = document.getElementById('error-container');
  if (oldMessage !== null) {
    authForm.removeChild(oldMessage);
  }

  const errorContainer = document.createElement('div');
  errorContainer.id = 'error-container';
  const messageText = document.createElement('p');
  messageText.innerHTML = convertNewLineToBreakTag(message);
  errorContainer.appendChild(messageText);
  authForm.prepend(errorContainer);
}

export { createInput, createTextarea, createButton, displayError };