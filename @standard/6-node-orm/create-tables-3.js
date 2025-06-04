// Import Sequelize
import { Sequelize, DataTypes, fn, col } from 'sequelize'

// Create the sequelize object
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'app1',
  password: 'welcome123',
  database: 'ismv4'
})

// Define the models
const Restaurant = sequelize.define('Restaurant', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  openingHour: {
    type: DataTypes.TIME,
    allowNull: false
  },
  closingHour: {
    type: DataTypes.TIME,
    allowNull: false
  }
})

const Location = sequelize.define('Location', {
  street: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

const Menu = sequelize.define('Menu', {
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

const MenuItem = sequelize.define('MenuItem', {
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
})

// Define the associations
Restaurant.hasMany(Location)
Location.belongsTo(Restaurant)

Restaurant.hasOne(Menu)
Menu.belongsTo(Restaurant)

Menu.belongsToMany(MenuItem, { through: 'MenuItemMapping' })
MenuItem.belongsToMany(Menu, { through: 'MenuItemMapping' })

// Synchronize the models with the database

try {
  // Add two restaurants
  await sequelize.sync({ force: true})

  const restaurant1 = await Restaurant.create({ name: 'Restaurant 1', openingHour: '10:00', closingHour: '22:00' })
  const restaurant2 = await Restaurant.create({ name: 'Restaurant 2', openingHour: '11:00', closingHour: '23:00' })

  // Modify the name of the first restaurant
  await restaurant1.update({ name: 'Updated Restaurant 1' })

  // Add a location to each of the restaurants above
  const location1 = await Location.create({ street: '123 Main St', number: '1A', city: 'New York' })
  await restaurant1.addLocation(location1)
  const location2 = await Location.create({ street: '456 Broad St', number: '2B', city: 'Los Angeles' })
  await restaurant2.addLocation(location2)

  // Add a menu to each restaurant
  const menu1 = await Menu.create({ description: 'Menu 1' })
  await restaurant1.setMenu(menu1)
  const menu2 = await Menu.create({ description: 'Menu 2' })
  await restaurant2.setMenu(menu2)

  // Add two items to each menu; the items should be different
  const menuItem11 = await MenuItem.create({ description: 'MenuItem 11', price: 10.99 })
  const menuItem12 = await MenuItem.create({ description: 'MenuItem 12', price: 12.99 })
  await menu1.addMenuItem([menuItem11, menuItem12])

  const menuItem21 = await MenuItem.create({ description: 'MenuItem 21', price: 8.99 })
  const menuItem22 = await MenuItem.create({ description: 'MenuItem 22', price: 9.99 })
  await menu2.addMenuItem([menuItem21, menuItem22])

  // Add an item that is included in both menus
  const menuItemShared = await MenuItem.create({ description: 'Shared MenuItem', price: 14.99 })
  await menu1.addMenuItem(menuItemShared)
  await menu2.addMenuItem(menuItemShared)

  // Add a third location to the first restaurant
  const location3 = await Location.create({ street: '789 Elm St', number: '3C', city: 'Chicago' })
  await restaurant1.addLocation(location3)

  // Delete the third location from the first restaurant
  await restaurant1.removeLocation(location3)

  let results = await Restaurant.findAll({
    where: { id: 1 },
    include: [
      {
        model: Menu,
        include: [{ model: MenuItem }]
      }
    ],
    raw: true
  })

  // Get all menu items for the first restaurant
  const menuItems = results

  console.log('Menu items for the first restaurant:', menuItems)

  console.log('All operations completed successfully!')
} catch (error) {
  console.error('An error occurred:', error)
}

