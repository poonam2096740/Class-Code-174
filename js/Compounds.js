AFRAME.registerComponent('atoms', {
  init: async function(){
    var compounds = await this.getCompounds()
    console.log(compounds)
    var barcodes = Object.keys(compounds)
    console.log(barcodes)
    barcodes.map(barcode => {
      var element = compounds[barcode]
      console.log(element)
      this.createAtoms(element)
    })
  },
  getCompounds: function(){
    return fetch('js/compoundList.json')
    .then(res => res.json())
    .then(data => data)
  },
  getElementColors: function(){
    return fetch('js/elementColors.json')
    .then(res => res.json())
    .then(data => data)
  },
  createAtoms: async function(element){
    var elementName = element.element_name
    var barcodeValue = element.barode_value
    var numberOfElectrons = element.number_of_electron
    var colors = await this.getElementColors()
    var scene = document.querySelector('a-scene')
    var marker = document.createElement('a-marker')
    marker.setAttribute('id', `marker-${barcodeValue}`)
    marker.setAttribute('type', 'barcode')
    marker.setAttribute('element_name', elementName)
    marker.setAttribute('value', barcodeValue)
    scene.appendChild(marker)

    var atom = document.createElement('a-entity')
    atom.setAttribute('id', `${elementName}-${barcodeValue}`)
    marker.appendChild(atom)

    var card = document.createElement('a-entity')
    card.setAttribute('id', `card-${elementName}`)
    card.setAttribute('geoometry', {
      primitive: 'plane',
      width: 1,
      height: 1
    })
    card.setAttribute('material', {
      src: `./assets/atom_cards/card_${elementName}.png`
    })
    card.setAttribute('position', {x: 0, y: 0, z: 0})
    card.setAttribute('rotation', {x: -90, y: 0, z: 0})
    atom.appendChild(card)

    console.log('yess the code works!')

    var nucleusRadius = 0.2
    var nucleus = document.createElement('a-entity')
    nucleus.setAttribute('id', `nucleus-${elementName}`)
    nucleus.setAttribute('geometry', {
      primitive: 'sphere',
      radius: nucleusRadius
    })
    nucleus.setAttribute('material', 'color', colors[elementName])
    nucleus.setAttribute('position', {x: 0, y: 1, z: 0})
    nucleus.setAttribute('rotation', {x: 0, y: 0, z: 0})
    
    var nucleusName = document.createElement('a-entity')
    nucleusName.setAttribute('id', `nucleus-name-${elementName}`)
    nucleusName.setAttribute('position', {x: 0, y: 0.2, z: -0.06})
    nucleusName.setAttribute('rotation', {x: -90, y: 0, z: 0})
    nucleusName.setAttribute('text', {
      value: elementName,
      font: 'monoid',
      width: 3,
      color: 'black',
      align: 'center'
    })
    nucleus.appendChild(nucleusName)
    atom.appendChild(nucleus)

    var orbitAngle = -180;
    var electronAngle = 30;

    for (var num = 1; num <= numOfElectron; num++) {
      //Create orbit
      var orbit = document.createElement("a-entity");
      orbit.setAttribute("geometry", {
        primitive: "torus",
        arc: 360,
        radius: 0.28,
        radiusTubular: 0.001
      });

      orbit.setAttribute("material", {
        color: "#ff9e80",
        opacity: 0.3
      });

      orbit.setAttribute("position", {
        x: 0,
        y: 1,
        z: 0
      });

      orbit.setAttribute("rotation", {
        x: 0,
        y: orbitAngle,
        z: 0
      });

      orbitAngle += 45;

      atom.appendChild(orbit);

      //Create electron revolution animation entity
      var electronGroup = document.createElement("a-entity");
      electronGroup.setAttribute("id", `electron-group-${elementName}`);
      electronGroup.setAttribute("rotation", {
        x: 0,
        y: 0,
        z: electronAngle
      });

      electronAngle += 65;

      electronGroup.setAttribute("animation", {
        property: "rotation",
        to: `0 0 -360`,
        loop: "true",
        dur: 3500,
        easing: "linear"
      });

      orbit.appendChild(electronGroup);

      //Create electron
      var electron = document.createElement("a-entity");
      electron.setAttribute("id", `electron-${elementName}`);
      electron.setAttribute("geometry", {
        primitive: "sphere",
        radius: 0.02
      });

      electron.setAttribute("material", { color: "#0d47a1", opacity: 0.6 });
      electron.setAttribute("position", {
        x: 0.2,
        y: 0.2,
        z: 0
      });

      electronGroup.appendChild(electron);
    }
  },
})