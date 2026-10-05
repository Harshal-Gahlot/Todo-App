import { useState, useRef } from "react";
import { ChevronDown, Globe, Lock, Layers } from "lucide-react";
import useClosePopupOutside from "../../../utils/close outside click";
import "./category switcher.css";

const CATEGORY_OPTIONS = [
    { type: "All", icon: Layers },
    { type: "Public", icon: Globe },
    { type: "Private", icon: Lock },
];

export default function TodoCategorySwitcher({ showCategory = "all", setShowCategory }) {
    const dropdownRef = useRef(null);
    const currentOption = CATEGORY_OPTIONS.find((opt) => opt.type.toLowerCase() == showCategory) || CATEGORY_OPTIONS[0];
    const CurrentIcon = currentOption.icon;
    const [isOpen, setIsOpen] = useState(false);
    useClosePopupOutside(dropdownRef, setIsOpen, false);

    function onSelectCategory(newCategory) {
        const userSettings = JSON.parse(localStorage.getItem("settings"));
        userSettings.showCategory = newCategory;
        localStorage.setItem("settings", JSON.stringify(userSettings));
        setShowCategory(newCategory);
    }

    return (
        <div className="category-switcher" ref={dropdownRef}>
            <button
                name="button"
                className="category-switcher-btn"
                onClick={() => setIsOpen((prev) => !prev)}
                type="Filter by category"
            >
                <CurrentIcon className="category-switcher-icon" />
                <span className="category-switcher-label">{currentOption.type}</span>
                <ChevronDown className={`category-switcher-chevron ${isOpen ? "open" : ""}`} />
            </button>

            {isOpen && (
                <ul className="category-switcher-menu">
                    {CATEGORY_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = opt.type.toLowerCase() === showCategory;
                        return (
                            <li
                                key={opt.type}
                                className={`category-switcher-item ${isSelected ? "selected" : ""}`}
                                onClick={() => {
                                    onSelectCategory(opt.type.toLowerCase());
                                    setIsOpen(false);
                                }}
                            >
                                <Icon className="category-switcher-item-icon" />
                                <span>{opt.type}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
