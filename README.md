# EWI

1. **Read and Parse Instructions:**

   * Fetch the XML file containing the instructions and parse it to get the data for each step.
   * Each instruction has a description and inputs that the user will need to provide.
   * Ensure that all instructions are read correctly before proceeding.

2. **Display Instructions One at a Time:**

   * Show the current instruction's description to the user.
   * Based on the inputs required for the current step, generate a form for the user to fill in.
   * Once the user fills out the form, validate the inputs (if necessary).

3. **Store User Inputs:**

   * For each step completed, capture the user's inputs.
   * Responses are stored in JSON format in `responses.json`.
   * To store data in CSV, replace the JSON storage backend with a CSV implementation.
   * Each entry should contain:

     * The step ID.
     * A timestamp of when the user completed the step.
     * The user’s inputs for that step.

4. **Move to Next Step:**

   * Once the user completes the current step, proceed to the next step.
   * Display the next instruction and repeat the process.
   * If it's the last instruction, inform the user that they've completed the task.

5. **Handle Errors Gracefully:**

   * If the user inputs incorrect data or leaves a field blank, prompt them to correct it.
   * If the user submits invalid data (e.g., in the case of an incorrect format or missing fields), inform them politely and allow them to re-enter the data.


## Running the App

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Start the server:

```bash
uvicorn app.main:app --reload
```

The API exposes the following endpoints:

- `GET /sop/start` – fetch the first step.
- `GET /sop/step/{step_id}` – retrieve a step by ID.
- `POST /sop/step/{step_id}` – submit user input for a step and advance.

Responses are stored in `responses.json`.
