const fs = require("node:fs/promises");

const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "db", "contacts.json");
// console.log(contactsPath);

async function readContactsList() {
  try {
    const data = await fs.readFile(contactsPath, { encoding: "UTF-8" });
    // console.log(data);
    return JSON.parse(data);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function writeContactsList(contacts) {
  try {
    return await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    throw new Error(error.message);
  }
}

async function listContacts() {
  try {
    return await readContactsList();
  } catch (error) {
    throw error;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await readContactsList();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact || null;
  } catch (error) {
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await readContactsList();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      return null;
    }
    const newContacts = [
      ...contacts.slice(0, index),
      contacts.slice(index + 1),
    ];
    await writeContactsList(newContacts);
    return contacts[index];
  } catch (error) {
    throw error;
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await readContactsList();
    const newContact = { id: crypto.randomUUID(), name, email, phone };
    contacts.push(newContact);
    await writeContactsList(contacts);
    return newContact || null;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
