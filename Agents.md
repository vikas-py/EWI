# Codex Agents Documentation for Web App Project

## Overview

This document outlines the responsibilities, tasks, workflow, and implementation details for the Codex agents involved in the web app project using **FastAPI**. The web app will read instructions from an XML file, display them to the user one by one, collect user inputs for each step, and store those inputs along with execution details. The agent is responsible for managing the flow, validating inputs, providing feedback, and ensuring smooth progression through the steps.

---

## Agent Responsibilities

### **1. Read and Parse Instructions**

* **Goal:** Load and parse instructions from an XML file, so the agent can display them one by one to the user.
* **Tasks:**

  * **Parse XML File**: The agent will parse the XML file, which contains a series of instructions. Each instruction consists of a description and a set of input fields that the user must fill out.
  * **Data Structure**: Each instruction will be stored in memory as a dictionary-like structure. Each step should have an ID, description, and associated inputs.
  * **Ensure Validity**: Ensure that the XML file is well-formed and contains all required information, such as descriptions and inputs.

#### Example XML Structure:

```xml
<instructions>
  <step>
    <id>1</id>
    <description>Step 1: Open the app</description>
    <inputs>
      <input name="username" type="text" label="Enter your username" />
      <input name="password" type="password" label="Enter your password" />
    </inputs>
  </step>
  <step>
    <id>2</id>
    <description>Step 2: Verify credentials</description>
    <inputs>
      <input name="verification_code" type="text" label="Enter verification code" />
    </inputs>
  </step>
</instructions>
```

### **2. Display Instructions to the User**

* **Goal:** Display each instruction (one at a time) along with the required input fields.
* **Tasks:**

  * **Generate Forms**: For each instruction, generate an HTML form dynamically based on the input types specified in the XML.
  * **Display Instruction Description**: Show the description of the current step to the user.
  * **Capture User Inputs**: Collect user inputs in the form fields, such as text, passwords, or any other required field type.
  * **Handle Form Submission**: When the user submits the form, ensure that data is properly validated before moving to the next step.

### **3. Collect User Inputs**

* **Goal:** Gather user inputs for each instruction and store them for later processing.
* **Tasks:**

  * **Store User Inputs**: After each step, save the user inputs in a structured file (e.g., JSON or CSV). Each entry will include:

    * **Step ID**: The ID of the current step.
    * **Timestamp**: The time the step was completed.
    * **Inputs**: A dictionary containing the user’s responses for that step.
  * **Input Validation**: Ensure that required fields are filled and the data is valid (e.g., no empty fields, proper format).
  * **User Feedback**: If a user leaves an input field empty or provides invalid data, the agent should display an error message and allow the user to correct it.

#### Example of Collected User Data in JSON:

```json
[
  {
    "step_id": 1,
    "timestamp": "2025-07-25T15:30:00",
    "inputs": {
      "username": "user1",
      "password": "password123"
    }
  },
  {
    "step_id": 2,
    "timestamp": "2025-07-25T15:35:00",
    "inputs": {
      "verification_code": "123456"
    }
  }
]
```

### **4. Store Execution Details**

* **Goal:** Save the user inputs, timestamps, and execution details to a persistent storage file (e.g., JSON or CSV).
* **Tasks:**

  * **Data Structure**: Store the collected user data in a file that can be easily updated and retrieved. Use a structured format like JSON, ensuring easy reading and appending of new data.
  * **Append to File**: If the storage file already exists, append the new data to it without overwriting previous entries.
  * **File Integrity**: Handle cases where the file may not exist yet (i.e., first run of the application), and create a new file if necessary.

### **5. Progress to the Next Step**

* **Goal:** Move the user to the next instruction after they complete the current one.
* **Tasks:**

  * **Increment Step ID**: Once the user submits the form for the current step, move to the next step based on the step ID.
  * **Display Next Instruction**: Load and display the next instruction.
  * **Final Step**: If the current step is the last one, inform the user that they have completed all instructions and the process is complete.

### **6. Error Handling and User Feedback**

* **Goal:** Provide clear, helpful error messages to users in case of invalid inputs or mistakes.
* **Tasks:**

  * **Input Validation**: Ensure all required fields are completed and the input data is in the correct format.
  * **User-Friendly Error Messages**: If the user submits incomplete or invalid data, show an error message indicating what needs to be corrected (e.g., “Please fill out all required fields” or “Invalid email format”).
  * **Retry Mechanism**: Allow the user to re-enter the data and proceed after fixing any errors.

---

## Agent Workflow

### **1. Initialization**

* **Action:** On application startup, the agent will:

  * Load the XML file containing instructions.
  * Parse the XML to extract the steps and inputs.
  * Initialize the data storage file (`user_data.json`) for capturing user inputs.

### **2. Instruction Display**

* **Action:** The agent will:

  * Retrieve the current step from the parsed XML.
  * Display the step description to the user.
  * Generate and display a form based on the inputs for that step.
  * Provide a submit button for the user to move forward.

### **3. Input Collection**

* **Action:** When the user submits the form:

  * Capture the user's input values.
  * Perform validation on the inputs (check for completeness, correct format, etc.).
  * Store the data in the file (`user_data.json`) for the current step.

### **4. Moving to the Next Step**

* **Action:** After collecting and saving the input:

  * Move to the next instruction.
  * Display the next step's description and form.
  * If there are no more steps, show a completion message.

### **5. Error Handling**

* **Action:** If there is an error with the input:

  * Display an error message indicating what was wrong.
  * Allow the user to correct the mistake and re-submit the form.

---

## File Structure

### **instructions.xml** Example:

```xml
<instructions>
  <step>
    <id>1</id>
    <description>Step 1: Open the app and log in</description>
    <inputs>
      <input name="username" type="text" label="Enter username" />
      <input name="password" type="password" label="Enter password" />
    </inputs>
  </step>
  <step>
    <id>2</id>
    <description>Step 2: Confirm your email address</description>
    <inputs>
      <input name="email_confirmation_code" type="text" label="Enter confirmation code" />
    </inputs>
  </step>
</instructions>
```

---

## Testing and Validation

### **1. Instruction Parsing**

* **Test Case:** Ensure that the XML file is correctly loaded and parsed. Verify that each instruction and input is correctly extracted from the XML file.

### **2. Input Validation**

* **Test Case:** Test that all required input fields are validated properly:

  * Ensure that no field is left empty when required.
  * Test input formats (e.g., check for valid email format, numeric values, etc.).
  * Ensure that invalid inputs trigger the correct error messages.

### **3. Data Storage**

* **Test Case:** Verify that user inputs are stored in the `user_data.json` file and the file is correctly updated after each step.

  * Test appending new data to the file.
  * Test that the file is created if it doesn’t already exist.

### **4. Step Progression**

* **Test Case:** Ensure that the user is moved to the next step after submitting their data.

  * Test for correct flow through all steps.
  * Ensure the completion message appears after the last step.
