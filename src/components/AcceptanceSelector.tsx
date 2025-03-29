
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AcceptanceSelectorProps {
  trashType: string;
  onTrashTypeChange: (value: string) => void;
  acceptedCategories: string[];
  onAcceptedCategoriesChange: (categories: string[]) => void;
}

const AcceptanceSelector: React.FC<AcceptanceSelectorProps> = ({ 
  trashType, 
  onTrashTypeChange, 
  acceptedCategories, 
  onAcceptedCategoriesChange 
}) => {
  const handleCategoryToggle = (category: string) => {
    if (acceptedCategories.includes(category)) {
      onAcceptedCategoriesChange(acceptedCategories.filter(c => c !== category));
    } else {
      onAcceptedCategoriesChange([...acceptedCategories, category]);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="trash-type">Select Trash Color:</Label>
        <Select value={trashType} onValueChange={onTrashTypeChange}>
          <SelectTrigger id="trash-type">
            <SelectValue placeholder="Select trash type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Dark Trash</SelectItem>
            <SelectItem value="light">Light Trash</SelectItem>
            <SelectItem value="colorful">Colorful Trash</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Accept Only These Categories:</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash'].map(category => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`px-3 py-2 rounded text-sm ${
                acceptedCategories.includes(category)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcceptanceSelector;
