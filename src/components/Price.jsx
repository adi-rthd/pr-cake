import React from 'react';

const Price = ({ amount, size = 'normal', className = '', prefix = '' }) => {
  const numericAmount = isNaN(Number(amount)) ? 0 : Number(amount);
  const formattedAmount = numericAmount.toLocaleString('en-IN');

  let sizeClasses = '';
  switch(size) {
    case 'xsmall':
      sizeClasses = 'text-xs font-semibold';
      break;
    case 'small':
      sizeClasses = 'text-sm font-semibold';
      break;
    case 'normal':
      sizeClasses = 'text-[17px] font-bold';
      break;
    case 'large':
      sizeClasses = 'text-2xl font-bold';
      break;
    case 'xlarge':
      sizeClasses = 'text-3xl font-bold';
      break;
    default:
      sizeClasses = 'text-[17px] font-bold';
  }

  return (
    <span className={`font-sans tabular-nums ${sizeClasses} ${className}`}>
      {prefix}₹{formattedAmount}
    </span>
  );
};

export default Price;
