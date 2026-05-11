import { Page } from "@playwright/test";
import Logger from "./LoggerUtil";

export default class ElementActionUtil {
  private page: Page;
  private logger: Logger;

  constructor(page: Page, logger: Logger) {
    this.page = page;
    this.logger = logger;
  }

  async fillinput(selector: string, text: string): Promise<void> {
    try {
      await this.page.fill(selector, text);
      this.logger.info(
        `Input filled for selector ${selector} with text: ${text}`,
      );
    } catch (error) {
      this.logger.error(
        `Error filling input for selector ${selector}: ${error}`,
      );
      throw error;
    }
  }

  async clickButtonByText(text: string): Promise<void> {
    try {
      await this.page.getByText(text).click();
      this.logger.info(`${text} button clicked.`);
    } catch (error) {
      this.logger.error(`Error clicking button with text ${text}: ${error}`);
      throw error;
    }
  }

  async clickButtonByRole(name: string): Promise<void> {
    try {
      await this.page.getByRole("button", { name }).click();
      this.logger.info(`${name} button clicked.`);
    } catch (error) {
      this.logger.error(
        `Error clicking button with role and name ${name}: ${error}`,
      );
      throw error;
    }
  }

  async clickHyperlinkByRole(name: string): Promise<void> {
    try {
      await this.page.getByRole("link", { name }).click();
      this.logger.info(`${name} hyperlink clicked.`);
    } catch (error) {
      this.logger.error(
        `Error clicking hyperlink with role and name ${name}: ${error}`,
      );
      throw error;
    }
  }

  async clickByLocator(locator: string): Promise<void> {
    try {
      await this.page.locator(locator).click();
      this.logger.info(`Element clicked by locator: ${locator}`);
    } catch (error) {
      this.logger.error(
        `Error clicking element by locator ${locator}: ${error}`,
      );
      throw error;
    }
  }

  async isButtonVisible(name: string): Promise<boolean> {
    try {
      const button = await this.page.getByRole("button", { name });
      const isVisible = await button.isVisible();
      this.logger.info(`${name} button visible: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logger.error(
        `Error checking visibility of button with name ${name}: ${error}`,
      );
      throw error;
    }
  }

  // ============= CHECKBOX UTILITIES =============

  /**
   * Check a checkbox by selector
   */
  async checkCheckbox(selector: string): Promise<void> {
    try {
      const checkbox = this.page.locator(selector);
      const isChecked = await checkbox.isChecked();

      if (!isChecked) {
        await checkbox.check();
        this.logger.info(`✓ Checkbox checked: ${selector}`);
      } else {
        this.logger.info(`Checkbox already checked: ${selector}`);
      }
    } catch (error) {
      this.logger.error(`✗ Error checking checkbox ${selector}: ${error}`);
      throw error;
    }
  }

  /**
   * Uncheck a checkbox by selector
   */
  async uncheckCheckbox(selector: string): Promise<void> {
    try {
      const checkbox = this.page.locator(selector);
      const isChecked = await checkbox.isChecked();

      if (isChecked) {
        await checkbox.uncheck();
        this.logger.info(`✓ Checkbox unchecked: ${selector}`);
      } else {
        this.logger.info(`Checkbox already unchecked: ${selector}`);
      }
    } catch (error) {
      this.logger.error(`✗ Error unchecking checkbox ${selector}: ${error}`);
      throw error;
    }
  }

  /**
   * Toggle checkbox state
   */
  async toggleCheckbox(selector: string): Promise<void> {
    try {
      const isChecked = await this.page.locator(selector).isChecked();
      if (isChecked) {
        await this.uncheckCheckbox(selector);
      } else {
        await this.checkCheckbox(selector);
      }
    } catch (error) {
      this.logger.error(`✗ Error toggling checkbox ${selector}: ${error}`);
      throw error;
    }
  }

  /**
   * Check if checkbox is checked
   */
  async isCheckboxChecked(selector: string): Promise<boolean> {
    try {
      const isChecked = await this.page.locator(selector).isChecked();
      this.logger.info(`Checkbox checked: ${isChecked} for ${selector}`);
      return isChecked;
    } catch (error) {
      this.logger.error(
        `✗ Error checking checkbox state ${selector}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Check checkbox by label text
   */
  async checkCheckboxByLabel(labelText: string): Promise<void> {
    try {
      const checkbox = this.page
        .getByLabel(labelText)
        .locator("input[type='checkbox']");
      const isChecked = await checkbox.isChecked();

      if (!isChecked) {
        await checkbox.check();
        this.logger.info(`✓ Checkbox checked by label: ${labelText}`);
      }
    } catch (error) {
      this.logger.error(
        `✗ Error checking checkbox by label ${labelText}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Uncheck checkbox by label text
   */
  async uncheckCheckboxByLabel(labelText: string): Promise<void> {
    try {
      const checkbox = this.page
        .getByLabel(labelText)
        .locator("input[type='checkbox']");
      const isChecked = await checkbox.isChecked();

      if (isChecked) {
        await checkbox.uncheck();
        this.logger.info(`✓ Checkbox unchecked by label: ${labelText}`);
      }
    } catch (error) {
      this.logger.error(
        `✗ Error unchecking checkbox by label ${labelText}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Get all checked checkboxes
   */
  async getCheckedCheckboxes(selector: string): Promise<string[]> {
    try {
      const checkboxes = this.page.locator(selector);
      const count = await checkboxes.count();
      const checkedValues: string[] = [];

      for (let i = 0; i < count; i++) {
        const checkbox = checkboxes.nth(i);
        if (await checkbox.isChecked()) {
          const value = await checkbox.getAttribute("value");
          if (value) checkedValues.push(value);
        }
      }

      this.logger.info(`Found ${checkedValues.length} checked checkboxes`);
      return checkedValues;
    } catch (error) {
      this.logger.error(`✗ Error getting checked checkboxes: ${error}`);
      throw error;
    }
  }

  // ============= RADIO BUTTON UTILITIES =============

  /**
   * Select a radio button by selector
   */
  async selectRadioButton(selector: string): Promise<void> {
    try {
      const radio = this.page.locator(selector);
      await radio.check();
      this.logger.info(`✓ Radio button selected: ${selector}`);
    } catch (error) {
      this.logger.error(`✗ Error selecting radio button ${selector}: ${error}`);
      throw error;
    }
  }

  /**
   * Select radio button by value
   */
  async selectRadioButtonByValue(
    groupSelector: string,
    value: string,
  ): Promise<void> {
    try {
      const radio = this.page.locator(
        `${groupSelector} input[type='radio'][value='${value}']`,
      );
      await radio.check();
      this.logger.info(`✓ Radio button selected by value: ${value}`);
    } catch (error) {
      this.logger.error(
        `✗ Error selecting radio button by value ${value}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Select radio button by label text
   */
  async selectRadioButtonByLabel(labelText: string): Promise<void> {
    try {
      const radio = this.page.getByLabel(labelText);
      await radio.check();
      this.logger.info(`✓ Radio button selected by label: ${labelText}`);
    } catch (error) {
      this.logger.error(
        `✗ Error selecting radio button by label ${labelText}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Check if radio button is selected
   */
  async isRadioButtonSelected(selector: string): Promise<boolean> {
    try {
      const isSelected = await this.page.locator(selector).isChecked();
      this.logger.info(`Radio button selected: ${isSelected}`);
      return isSelected;
    } catch (error) {
      this.logger.error(
        `✗ Error checking radio button state ${selector}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Get selected radio button value in a group
   */
  async getSelectedRadioButtonValue(
    groupSelector: string,
  ): Promise<string | null> {
    try {
      const selectedRadio = this.page.locator(
        `${groupSelector} input[type='radio']:checked`,
      );
      const value = await selectedRadio.getAttribute("value");
      this.logger.info(`Selected radio button value: ${value}`);
      return value;
    } catch (error) {
      this.logger.error(`✗ Error getting selected radio button: ${error}`);
      return null;
    }
  }

  /**
   * Get all radio button options in a group
   */
  async getRadioButtonOptions(groupSelector: string): Promise<string[]> {
    try {
      const radios = this.page.locator(`${groupSelector} input[type='radio']`);
      const count = await radios.count();
      const options: string[] = [];

      for (let i = 0; i < count; i++) {
        const value = await radios.nth(i).getAttribute("value");
        if (value) options.push(value);
      }

      this.logger.info(`Found ${options.length} radio button options`);
      return options;
    } catch (error) {
      this.logger.error(`✗ Error getting radio button options: ${error}`);
      throw error;
    }
  }

  // ============= DROPDOWN/SELECT UTILITIES =============

  /**
   * Select option from dropdown by value
   */
  async selectDropdownByValue(selector: string, value: string): Promise<void> {
    try {
      await this.page.locator(selector).selectOption(value);
      this.logger.info(`✓ Dropdown option selected by value: ${value}`);
    } catch (error) {
      this.logger.error(`✗ Error selecting dropdown option ${value}: ${error}`);
      throw error;
    }
  }

  /**
   * Select option from dropdown by label text
   */
  async selectDropdownByLabel(selector: string, label: string): Promise<void> {
    try {
      const dropdown = this.page.locator(selector);
      await dropdown.selectOption(label);
      this.logger.info(`✓ Dropdown option selected by label: ${label}`);
    } catch (error) {
      this.logger.error(
        `✗ Error selecting dropdown option by label ${label}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Select option from dropdown by index
   */
  async selectDropdownByIndex(selector: string, index: number): Promise<void> {
    try {
      const options = await this.page.locator(`${selector} option`).all();

      if (index < 0 || index >= options.length) {
        throw new Error(
          `Invalid index ${index}. Available options: ${options.length}`,
        );
      }

      const value = await options[index].getAttribute("value");
      if (value) {
        await this.page.locator(selector).selectOption(value);
        this.logger.info(`✓ Dropdown option selected by index: ${index}`);
      }
    } catch (error) {
      this.logger.error(
        `✗ Error selecting dropdown option by index ${index}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Get selected option value from dropdown
   */
  async getSelectedDropdownValue(selector: string): Promise<string | null> {
    try {
      const value = await this.page.locator(selector).inputValue();
      this.logger.info(`Selected dropdown value: ${value}`);
      return value;
    } catch (error) {
      this.logger.error(`✗ Error getting selected dropdown value: ${error}`);
      return null;
    }
  }

  /**
   * Get selected option text from dropdown
   */
  async getSelectedDropdownText(selector: string): Promise<string | null> {
    try {
      const value = await this.page.locator(selector).inputValue();
      const text = await this.page
        .locator(`${selector} option[value='${value}']`)
        .textContent();
      this.logger.info(`Selected dropdown text: ${text}`);
      return text;
    } catch (error) {
      this.logger.error(`✗ Error getting selected dropdown text: ${error}`);
      return null;
    }
  }

  /**
   * Get all dropdown options (values and labels)
   */
  async getDropdownOptions(
    selector: string,
  ): Promise<Array<{ value: string; label: string }>> {
    try {
      const options = await this.page.locator(`${selector} option`).all();
      const optionsList: Array<{ value: string; label: string }> = [];

      for (const option of options) {
        const value = await option.getAttribute("value");
        const label = await option.textContent();
        if (value && label) {
          optionsList.push({
            value,
            label: label.trim(),
          });
        }
      }

      this.logger.info(`Found ${optionsList.length} dropdown options`);
      return optionsList;
    } catch (error) {
      this.logger.error(`✗ Error getting dropdown options: ${error}`);
      throw error;
    }
  }

  /**
   * Get count of dropdown options
   */
  async getDropdownOptionCount(selector: string): Promise<number> {
    try {
      const count = await this.page.locator(`${selector} option`).count();
      this.logger.info(`Dropdown has ${count} options`);
      return count;
    } catch (error) {
      this.logger.error(`✗ Error counting dropdown options: ${error}`);
      throw error;
    }
  }

  /**
   * Check if dropdown option exists
   */
  async dropdownOptionExists(
    selector: string,
    value: string,
  ): Promise<boolean> {
    try {
      const count = await this.page
        .locator(`${selector} option[value='${value}']`)
        .count();
      const exists = count > 0;
      this.logger.info(`Dropdown option exists: ${exists}`);
      return exists;
    } catch (error) {
      this.logger.error(`✗ Error checking if dropdown option exists: ${error}`);
      throw error;
    }
  }

  /**
   * Clear dropdown selection (set to empty/first option)
   */
  async clearDropdownSelection(selector: string): Promise<void> {
    try {
      await this.page.locator(selector).selectOption("");
      this.logger.info(`✓ Dropdown selection cleared`);
    } catch (error) {
      this.logger.error(`✗ Error clearing dropdown selection: ${error}`);
      throw error;
    }
  }

  /**
   * Check if dropdown is disabled
   */
  async isDropdownDisabled(selector: string): Promise<boolean> {
    try {
      const isDisabled = await this.page.locator(selector).isDisabled();
      this.logger.info(`Dropdown disabled: ${isDisabled}`);
      return isDisabled;
    } catch (error) {
      this.logger.error(`✗ Error checking dropdown disabled state: ${error}`);
      throw error;
    }
  }

  /**
   * Multi-select dropdown - select multiple options
   */
  async selectMultipleDropdownOptions(
    selector: string,
    values: string[],
  ): Promise<void> {
    try {
      await this.page.locator(selector).selectOption(values);
      this.logger.info(
        `✓ Multiple dropdown options selected: ${values.join(", ")}`,
      );
    } catch (error) {
      this.logger.error(
        `✗ Error selecting multiple dropdown options: ${error}`,
      );
      throw error;
    }
  }

  // /**
  //  * Get all selected values in multi-select dropdown
  //  */
  // async getSelectedMultipleDropdownValues(selector: string): Promise<string[]> {
  //   try {
  //     const values = await this.page
  //       .locator(`${selector} option:checked`)
  //       .evaluateAll((options: HTMLOptionElement[]) =>
  //         options.map((el) => el.value),
  //       );
  //     this.logger.info(`Selected multi-select values: ${values.join(", ")}`);
  //     return values;
  //   } catch (error) {
  //     this.logger.error(
  //       `✗ Error getting selected multi-select values: ${error}`,
  //     );
  //     throw error;
  //   }
  // }
}
