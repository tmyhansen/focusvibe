import React from "react";

interface InputField {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

interface FormProps {
  title: string;
  inputs: InputField[];
  errorMessage?: string;
  buttonText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form: React.FC<FormProps> = ({ title, inputs, errorMessage, buttonText, onSubmit }) => {
  const formContainerClass = "max-w-md w-full bg-white p-8 rounded-lg shadow-xl";
  const headerClass = "text-3xl font-semibold text-center text-gray-800 mb-6";
  const inputGroupClass = "space-y-4";
  const labelClass = "block text-lg font-medium text-gray-600";
  const inputClass = "w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const errorMessageClass = "text-red-500 text-sm";
  const buttonClass = "w-full py-3 mt-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";

  return (
    <div>
      <div className={formContainerClass}>
        <h1 className={headerClass}>{title}</h1>
        <form onSubmit={onSubmit} className={inputGroupClass}>
          {inputs.map((input) => (
            <div key={input.id}>
              <label htmlFor={input.id} className={labelClass}>
                {input.label}
              </label>
              <input
                type={input.type}
                id={input.id}
                value={input.value}
                onChange={input.onChange}
                className={inputClass}
                required={input.required}
                aria-invalid={!!errorMessage}
                aria-describedby={errorMessage ?? "form error"}
              />
            </div>
          ))}
          {errorMessage && <div className={errorMessageClass} aria-live="assertive">{errorMessage}</div>}
          <button type="submit" className={buttonClass}>
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;