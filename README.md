# Trello Backend 

A nice project with a nice description

---

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environment.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands:

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems

  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command:

    $ node -v

If you need to update `npm`, you can do it using `npm`! Cool, right? After running the following command, just open the command line again and be happy:

    $ npm install npm -g

### Yarn installation

After installing node, this project will need yarn too, so just run the following command:

    $ npm install -g yarn

---

## Install

    $ git clone https://github.com/GulabSinghSikarwar/Trello-BE.git
    $ cd Trello-BE
    $ npm install

## Configure app

Open `constant.js` and edit the Google credentials for the Google Auth feature.

## Running the project

    $ npm start

## Simple build for production

    $ npm build

---

## Using a Message Queue for Microservice Architecture

Here's an example of how you can use a message queue to improve the microservice architecture for the Task and Attachment services:

### Task Service

- The Task Service creates a new task and stores it in the database.
- The Task Service sends a `TaskCreated` message to a message queue (e.g., `task_created_queue`).
- The message contains the task ID and any other relevant information.

### Attachment Service

- The Attachment Service listens to the `task_created_queue` message queue.
- When a `TaskCreated` message is received, the Attachment Service processes the attachment for the task.
- The Attachment Service uploads the attachment to centralized storage and stores the attachment metadata in its own database.
- The Attachment Service sends an `AttachmentProcessed` message to a message queue (e.g., `attachment_processed_queue`).
- The message contains the task ID, attachment ID, and any other relevant information.

### Task Service (continued)

- The Task Service listens to the `attachment_processed_queue` message queue.
- When an `AttachmentProcessed` message is received, the Task Service updates the task with the attachment information.
- The Task Service returns a response to the client indicating that the task has been created with an attachment.

