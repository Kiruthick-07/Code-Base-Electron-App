# Card Component Feature Implementation

## Overview
This implementation adds a built-in Card component feature to the custom code editor, allowing users to easily insert customizable card components directly into their code.

## Features

### 1. Add Component Menu
- Located in the header under "Add Component" dropdown
- Contains "Add Button" and "Add Card" options
- Clicking "Add Card" opens the customization modal

### 2. Card Customization Modal
The modal allows users to customize:
- **Heading text** (default: "Card Heading")
- **Subheading text** (default: "Subheading") 
- **Content text** (default: "This is the card content.")
- **Background color** (default: #ffffff)
- **Text color** (default: #333333)
- **Padding** (default: 16px)
- **Border radius** (default: 8px)
- **Box shadow intensity** (none/small/medium/large)

### 3. Live Preview
- Real-time preview of the card as options are changed
- Shows exactly how the card will appear in the final code

### 4. Session Memory
- Remembers the last-used settings during the session
- Automatically loads previous customizations when reopening the modal

### 5. Advanced Preset System
- **Save Presets**: Save custom card configurations with descriptive names
- **Apply Presets**: Load and apply saved configurations instantly
- **Delete Presets**: Remove individual presets with confirmation
- **Export Presets**: Download presets as JSON files for backup/sharing
- **Import Presets**: Load presets from JSON files
- **Clear All Presets**: Bulk delete all presets for a component type
- **Session Memory**: Remembers last-used settings during the session
- **Persistent Storage**: Presets stored in localStorage for persistence
- **Duplicate Prevention**: Prevents overwriting existing preset names

## Technical Implementation

### Files Modified
1. **Header.jsx** - Added component selection state and dropdown handling
2. **ComponentLibraryModal.jsx** - Extended to support Card components with full customization
3. **App.css** - Added button styling for the modal
4. **Header.css** - Fixed CSS selector typo

### Key Functions
- `toHTML()` - Generates JSX code for the selected component
- `handleChange()` - Updates component properties in real-time
- `insertSnippetAtCursor()` - Inserts the generated code at cursor position
- Session storage integration for convenience

### Code Generation
The Card component generates inline HTML with:
- Inline styles for all customizable properties
- Proper HTML syntax with CSS styles
- Responsive design considerations
- Clean, readable code structure

## Usage Instructions

1. **Open the Modal**: Click "Add Component" → "Add Card" in the header
2. **Customize the Card**: Use the form fields to adjust appearance and content
3. **Preview**: See live preview of changes in real-time
4. **Insert**: Click "Insert" to add the card to your code at the current cursor position
5. **Save Presets**: Save configurations as presets for future use

## Preset Management

### Saving Presets
- Customize your card to your liking
- Enter a descriptive name in the preset field
- Click "Save Preset" or press Enter
- Presets are automatically saved and available for future use

### Using Presets
- Select a preset from the dropdown menu
- Click "Apply Preset" to load the configuration
- All settings will be restored instantly

### Managing Presets
- **Delete Individual**: Select a preset and click "Delete"
- **Export All**: Download all presets as a JSON file
- **Import Presets**: Load presets from a JSON file
- **Clear All**: Remove all presets for a component type

### Preset Sharing
- Export your presets to share with team members
- Import presets from others to use their configurations
- Presets are stored locally and persist between sessions

## Future Extensibility

The system is designed to easily add more built-in components:
- Input fields
- Navigation components
- Layout components
- Data display components

Each new component type can follow the same pattern:
1. Add to `defaultConfig`
2. Extend `toHTML()` function
3. Add form fields for customization
4. Update preview rendering

## Code Example

Generated Card component code:
```html
<div style="
  background-color: #ffffff;
  color: #333333;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 400px;
  font-family: Arial, sans-serif;
">
  <h2 style="margin: 0 0 8px; font-size: 1.25rem;">Card Heading</h2>
  <h4 style="margin: 0 0 12px; font-size: 1rem; color: rgba(0,0,0,0.6);">Subheading</h4>
  <p style="margin: 0; font-size: 0.95rem;">This is the card content.</p>
</div>
```
