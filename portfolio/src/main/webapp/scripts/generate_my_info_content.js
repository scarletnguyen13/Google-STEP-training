const myInfoContainer = document.getElementById('me');

const TAGS = {
  "Classification": [
    "Vietnamese Canadian", "Ambivert", "Coder by day, Writer by night"
  ],
  "3 Words describe me": ["Randomly Weird", "Ambitious", "Hard-working"],
  "Easily fall in love with": [
    "Dessert", "Puppies", "Nature", "(occasionally) People with glasses"
  ],
  "Dislike": ["People who complain a lot but don't act"]
}

for (let title in TAGS) {
  const infoContainer = document.createElement('div');
  infoContainer.className = "horizontal-container";
  const label = document.createElement('label');
  label.className = "label"
  label.innerHTML = `${title}: `;
  
  const contents = document.createElement('div');
  contents.className = "horizontal-container";
  TAGS[title].map(content => {
    const description = document.createElement('div');
    description.classList.add('center', 'description');
    description.innerHTML = content;
    contents.appendChild(description);
  });

  infoContainer.appendChild(label);
  infoContainer.appendChild(contents);

  myInfoContainer.append(infoContainer);
}