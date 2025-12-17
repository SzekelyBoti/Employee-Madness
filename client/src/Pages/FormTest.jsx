/**
 * @brief Component for testing various form input types and their styling.
 *
 * This is a development/testing component that renders a comprehensive form
 * containing different types of HTML input elements. It's used to verify:
 * - Form styling and CSS classes
 * - Input element rendering and behavior
 * - Responsive design and layout
 * - Accessibility attributes
 *
 * The form includes text inputs, color pickers, select boxes (single and multi),
 * checkboxes, radio buttons, textareas, and buttons to test the full range
 * of form controls.
 *
 * @returns {JSX.Element} A static form with various input types for testing purposes.
 */
const FormTest = () => (
    <form>
        {/* Text input field */}
        <div className="control">
            <label htmlFor="input">Input Element</label>
            <input type="text" id="input" />
        </div>

        {/* Color picker input */}
        <div className="control">
            <label htmlFor="color">Color Picker</label>
            <input type="color" id="color" />
        </div>

        {/* Single-select dropdown */}
        <div className="control">
            <label htmlFor="select">Select Element</label>
            <select id="select">
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="4">Option 4</option>
                <option value="5">Option 5</option>
            </select>
        </div>

        {/* Multi-select dropdown */}
        <div className="control">
            <label htmlFor="select-multi">Select Element With Multiple Options</label>
            <select id="select-multi" multiple>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="4">Option 4</option>
                <option value="5">Option 5</option>
            </select>
        </div>

        {/* Checkbox group */}
        <div className="control">
            <label>Checkboxes</label>

            <label htmlFor="option-1" className="checkbox">
                Option 1
                <input type="checkbox" id="option-1" />
            </label>

            <label htmlFor="option-2" className="checkbox">
                Option 2
                <input type="checkbox" id="option-2" />
            </label>

            <label htmlFor="option-3" className="checkbox">
                Option 3
                <input type="checkbox" id="option-3" />
            </label>
        </div>

        {/* Radio button group */}
        <div className="control">
            <label>Radios</label>

            <label htmlFor="radio-1" className="radio">
                Radio 1
                <input type="radio" name="radio" id="radio-1" />
            </label>

            <label htmlFor="radio-2" className="radio">
                Radio 2
                <input type="radio" name="radio" id="radio-2" />
            </label>
        </div>

        {/* Submit button */}
        <div className="buttons">
            <button>Button</button>
        </div>

        {/* Textarea for multi-line input */}
        <div className="control">
            <label htmlFor="textarea">Textarea</label>
            <textarea id="textarea" />
        </div>
    </form>
);

export default FormTest;
