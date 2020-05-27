class IconGenerator {
  constructor(size) {
    this.size = size;
  }

  generate(iconNames) {
    const icons = [];
    iconNames.map(name => 
      icons.push(this.createIcon(name))
    );
    return icons;
  }

  createIcon = (name) => {
    const icon = document.createElement('img');
    icon.src = `../images/icons/${name}-icon.png`;
    icon.className = 'icon';
    icon.style.width = this.size;
    return icon;
  }
}

export default IconGenerator;