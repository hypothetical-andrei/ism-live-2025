import mongoose from 'mongoose'

const LocationSchema = new mongoose.Schema({
  street: String,
  number: Number,
  city: String
})

// Define a schema for a menu item
const MenuItemSchema = new mongoose.Schema({
  description: String,
  price: Number
})

// Define a schema for a restaurant menu
const MenuSchema = new mongoose.Schema({
  description: String,
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }]
}) 

const RestaurantSchema = new mongoose.Schema({
  name: String,
  openingHour: String,
  closingHour: String,
  locations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }],
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  }
})

const Location = mongoose.model('Location', LocationSchema)
const MenuItem = mongoose.model('MenuItem', MenuItemSchema)
const Menu = mongoose.model('Menu', MenuSchema)
const Restaurant = mongoose.model('Restaurant', RestaurantSchema)

try {
  await mongoose.connect('mongodb://localhost:27017/ismv4')

  await mongoose.connection.dropDatabase()

  let restaurant1 = new Restaurant({
    name: 'McDonalds',
    openingHour: '8:00 AM',
    closingHour: '10:00 PM',
    locations: [],
    menu: null
  })
  await restaurant1.save()

    let restaurant2 = new Restaurant({
    name: 'Burger King',
    openingHour: '10:00 AM',
    closingHour: '9:00 PM',
    locations: [],
    menu: null
  })
  await restaurant2.save()

  restaurant1 = await Restaurant.findOne({ name: 'McDonalds' })
  restaurant1.name = 'Mickey D\'s'
  await restaurant1.save()

  const location1 = new Location({
    street: '123 Main St',
    number: 1,
    city: 'New York'
  })

  const savedLocation1 = await location1.save()
  restaurant1.locations.push(savedLocation1)
  await restaurant1.save()

  const location2 = new Location({
    street: '456 Oak St',
    number: 2,
    city: 'Los Angeles'
  })
  const savedLocation2 = await location2.save()
  
  restaurant2 = await Restaurant.findOne({ name: 'Burger King' })
  restaurant2.locations.push(savedLocation2)
  await restaurant2.save()

  let menu1 = new Menu({
    description: 'Mickey D\'s Menu',
    items: []
  })
  const savedMenu1 = await menu1.save()
  restaurant1.menu = savedMenu1
  await restaurant1.save()

  let menu2 = new Menu({
    description: 'Burger King Menu',
    items: []
  })
  const savedMenu2 = await menu2.save()
  restaurant2.menu = savedMenu2
  await restaurant2.save()

  const menuItem1 = new MenuItem({
    description: 'Big Mac',
    price: 4.99
  })
  const savedMenuItem1 = await menuItem1.save()
  const menuItem2 = new MenuItem({
    description: 'Fries',
    price: 2.49
  })
  const savedMenuItem2 = await menuItem2.save()
  
  menu1 = await Menu.findOne({ _id: restaurant1.menu })
  menu1.items.push(savedMenuItem1, savedMenuItem2)
  await menu1.save()

  // Add two items to the second menu
  restaurant2 = await Restaurant.findOne({ name: 'Burger King' })
  const menuItem3 = new MenuItem({
    description: 'Whopper',
    price: 5.99
  })
  const savedMenuItem3 = await menuItem3.save()
  const menuItem4 = new MenuItem({
    description: 'Onion Rings',
    price: 3.99
  })
  const savedMenuItem4 = await menuItem4.save()
  menu2 = await Menu.findOne({ _id: restaurant2.menu })
  menu2.items.push(savedMenuItem3, savedMenuItem4)
  await menu2.save()

  // Add an item that is included in both menus
  const menuItemCommon = new MenuItem({
    description: 'Soda',
    price: 1.99
  })
  const savedMenuItemCommon = await menuItemCommon.save()
  menu1.items.push(savedMenuItemCommon)
  menu2.items.push(savedMenuItemCommon)
  await menu1.save()
  await menu2.save()

  const location3 = new Location({
    street: '789 Elm St',
    number: 3,
    city: 'Chicago'
  })
  const savedLocation3 = await location3.save()
  restaurant1.locations.push(savedLocation3)
  await restaurant1.save()

  await Restaurant.updateMany({}, { $pull: { locations: location3._id }})
  await Location.findByIdAndDelete(savedLocation3._id)

  let restaurant = await Restaurant.findOne({ name: 'Mickey D\'s' })
    .populate({
      path: 'menu',
      populate: { path: 'items' }
    })

  console.log(restaurant.save)

  restaurant = await Restaurant.findOne({ name: 'Mickey D\'s' })
    .populate({
      path: 'menu',
      populate: { path: 'items' }
    }).lean()
  
  console.log(restaurant.save)

  console.log(JSON.stringify(restaurant, null, 2))

  const pipeline = [    
    {
      $match: { name: 'Mickey D\'s' }
    }, {
      $lookup: {
        from: 'menus',
        localField: 'menu',
        foreignField: '_id',
        as: 'menu'
      }
    }, {
      $unwind: '$menu'
    }, {
      $lookup: {
        from: 'menuitems',
        localField: 'menu.items',
        foreignField: '_id',
        as: 'items'
      }
    }, {
      $project: {
        _id: 0,
        items: 1
      }
    }, {
      $facet: {
        items: [
          { $unwind: '$items' },
          { $replaceRoot: { newRoot: '$items' } }
        ],
        count: [
          { $group: { _id: null, count: { $sum: { $size: '$items' } } } },
          { $project: { _id: 0 } }
        ]
      }
    }
  ]

  const result = await Restaurant.aggregate(pipeline)

  console.log(JSON.stringify(result, null, 2))

} catch (error) {
  console.warn(error)
} finally {
  await mongoose.connection.close()
}