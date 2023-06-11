const mongoose = require('mongoose');
if (process.argv.length < 3) {
  console.log("missing password");
  process.exit(1);
}
const password = process.argv[2];
const url = `mongodb+srv://tergitran:${password}@cluster0.nbc1paq.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then(res => {
    console.log(`phonebook:`);
    res.forEach(item => {
      console.log(item.name + ' ' + item.number);
    })
    mongoose.connection.close();
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(result => {
    console.log(result);
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  })
}



