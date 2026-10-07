import PropTypes from "prop-types";
import "./ToggleSwitch.css";

export default function ToggleSwitch({
    label,
    options = ["Off", "On"],
    checked = false,
    onChange,
    variant = "pill",
    id,
    name,
    disabled = false,
    ariaLabel,
}) {
    const handleChange = (e) => {
        onChange?.(e);
    };

    const handleKeyDown = (e) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            const newChecked = !checked;
            onChange?.({ target: { checked: newChecked, name, id } });
        }
    };

    const handleClick = () => {
        if (disabled) return;
        const newChecked = !checked;
        onChange?.({ target: { checked: newChecked, name, id } });
    };

    return (
        <div className={`toggle-switch-wrapper ${variant}`}>
            {label && (
                <label htmlFor={id} className="toggle-label">
                    {label}
                </label>
            )}
            <div
                className="toggle-track-container"
                role="switch"
                aria-checked={checked}
                aria-label={ariaLabel || label}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
            >
                <input
                    type="checkbox"
                    id={id}
                    name={name}
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    className="toggle-input"
                    aria-hidden="true"
                />
                <div className="toggle-track">
                    {variant === "pill" && (
                        <>
                            <span className="toggle-option toggle-option-first">
                                {options[0]}
                            </span>
                            <span className="toggle-option toggle-option-second">
                                {options[1]}
                            </span>
                            <span
                                className="toggle-thumb"
                                style={{
                                    transform: checked
                                        ? `translateX(calc(100% - 4px))`
                                        : "translateX(0)",
                                }}
                            />
                        </>
                    )}
                    {variant === "simple" && (
                        <span
                            className="toggle-thumb-simple"
                            style={{
                                transform: checked
                                    ? "translateX(20px)"
                                    : "translateX(0)",
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

ToggleSwitch.propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    variant: PropTypes.oneOf(["pill", "simple"]),
    id: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    ariaLabel: PropTypes.string,
};
