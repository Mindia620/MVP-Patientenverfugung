import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300',
  secondary: 'bg-secondary-400 text-white hover:bg-secondary-500 focus:ring-secondary-300',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-300',
  ghost: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-lg font-medium
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]} ${sizes[size]} ${className}
        `}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
