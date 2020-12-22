export const getFormatDate = (date) => {
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
    return `${ye}/${mo}/${da}`;
  }
  
  export const getFormatToday = () => {
    const today = new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(today)
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(today)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(today)
    return `${ye}/${mo}/${da}`;
  }