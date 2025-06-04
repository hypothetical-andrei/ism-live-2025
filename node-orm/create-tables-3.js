import { Sequelize, DataTypes, fn, col } from 'sequelize'

const connection = new Sequelize({
  dialect: 'mysql',
  database: 'test',
  username: 'root',
  password: 'root',
  host: 'localhost'
})

const Restaurant = connection.define('Restaurant', {
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

const Location = connection.define('Location', {
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

const Menu = connection.define('Menu', {
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
})


const MenuItem = connection.define('MenuItem', {
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
})

// define associations
Restaurant.hasMany(Location)
Location.belongsTo(Restaurant)

Restaurant.hasOne(Menu)
Menu.belongsTo(Restaurant)

Menu.belongsToMany(MenuItem, { through: 'MenuItemMapping' })
MenuItem.belongsToMany(Menu, { through: 'MenuItemMapping' })

try {
  await connection.sync({ force: true})
  const restaurant1 = await Restaurant.create({ name: 'Restaurant 1', openingHour: '10:00', closingHour: '22:00' })
  const restaurant2 = await Restaurant.create({ name: 'Restaurant 2', openingHour: '11:00', closingHour: '23:00' })

  await restaurant1.update({ name: 'Updated Restaurant 1' })
  const location1 = await Location.create({ street: '123 Main St', number: '1A', city: 'New York' })
  await restaurant1.addLocation(location1)
  const location2 = await Location.create({ street: '456 Broad St', number: '2B', city: 'Los Angeles' })
  await restaurant2.addLocation(location2)

  const menu1 = await Menu.create({ description: 'Menu 1' })
  await restaurant1.setMenu(menu1)
  const menu2 = await Menu.create({ description: 'Menu 2' })
  await restaurant2.setMenu(menu2)

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

  const location3 = await Location.create({ street: '789 Elm St', number: '3C', city: 'Chicago' })
  await restaurant1.addLocation(location3)
  await restaurant1.removeLocation(location3)

  let results = await Restaurant.findAll({
    where: {
      id: 1
    },
    include: [{
      model: Menu,
      include: [{
        model: MenuItem
      }]
    }],
    attributes: [connection.fn('UCASE', connection.col('name')), 'openingHour'],
    raw: true
  })

  console.log(results)

} catch (error) {
  console.warn(error)
} finally {
  if (connection) {
    await connection.close()
  }
}