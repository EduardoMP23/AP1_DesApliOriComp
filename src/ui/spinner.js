const spinner = document.getElementById('global-spinner');

export function showSpinner(){
  if (!spinner) return;
  spinner.classList.remove('hidden');
  spinner.setAttribute('aria-busy', 'true');
}

export function hideSpinner(){
  if (!spinner) return;
  spinner.classList.add('hidden');
  spinner.setAttribute('aria-busy', 'false');
}
