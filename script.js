const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const roomFilter = document.getElementById('room-filter');
const clearFilters = document.getElementById('clear-filters');
const toast = document.getElementById('toast');
const weekLabel = document.getElementById('week-label');
const bookingModal = document.getElementById('booking-modal');
const bookingForm = document.getElementById('booking-form');
const formError = document.getElementById('form-error');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2800);
}

function enableAppointmentDeletion(appointment, appointmentName) {
  const deleteButton = document.createElement('span');
  deleteButton.className = 'delete-appointment';
  deleteButton.setAttribute('role', 'button');
  deleteButton.setAttribute('tabindex', '0');
  deleteButton.setAttribute('aria-label', 'Excluir agendamento');
  deleteButton.textContent = '×';

  const deleteAppointment = (event) => {
    event.stopPropagation();
    if (window.confirm(`Excluir o agendamento de ${appointmentName}?`)) {
      appointment.remove();
      showToast('Agendamento excluido');
    }
  };

  deleteButton.addEventListener('click', deleteAppointment);
  deleteButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') deleteAppointment(event);
  });
  appointment.appendChild(deleteButton);
}

menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((navItem) => navItem.classList.remove('active'));
    item.classList.add('active');
    sidebar.classList.remove('open');
  });
});

roomFilter.addEventListener('change', () => {
  const selectedRoom = roomFilter.value;
  document.querySelectorAll('.room-card, .class-block').forEach((element) => {
    element.style.opacity = selectedRoom === 'Todas as salas' || element.dataset.room === selectedRoom ? '1' : '.2';
  });
  showToast(selectedRoom === 'Todas as salas' ? 'Exibindo todas as salas' : `Filtro aplicado: ${selectedRoom}`);
});

clearFilters.addEventListener('click', () => {
  roomFilter.value = 'Todas as salas';
  document.getElementById('date-filter').value = '18/08/2026 - 22/08/2026';
  document.querySelectorAll('.room-card, .class-block').forEach((element) => element.style.opacity = '1');
  showToast('Filtros limpos');
});

document.querySelectorAll('.class-block').forEach((appointment) => {
  appointment.addEventListener('click', () => {
    showToast(`${appointment.querySelector('b').textContent} · ${appointment.dataset.room}`);
  });
  enableAppointmentDeletion(appointment, appointment.querySelector('b').textContent);
});

// Agrupa os dois subhorarios de cada periodo na mesma faixa visual da grade.
function groupSchedulePeriods() {
  const board = document.querySelector('.schedule-board');
  const children = Array.from(board.children);
  const periodStarts = [6, 18, 30];

  periodStarts.reverse().forEach((start) => {
    const firstTimeSlot = children[start];
    const secondRowStart = start + 6;
    const firstCells = children.slice(start + 1, start + 6);
    const secondCells = children.slice(secondRowStart + 1, secondRowStart + 6);

    secondCells.forEach((secondCell, index) => {
      secondCell.querySelectorAll('.class-block').forEach((appointment) => firstCells[index].appendChild(appointment));
    });
    children.slice(secondRowStart, secondRowStart + 6).reverse().forEach((element) => element.remove());
    firstTimeSlot.classList.add('period-slot');
  });
}

groupSchedulePeriods();

function closeBookingModal() {
  bookingModal.hidden = true;
  formError.textContent = '';
}

document.getElementById('new-booking').addEventListener('click', () => {
  bookingModal.hidden = false;
  document.getElementById('class-name').focus();
});
document.getElementById('close-modal').addEventListener('click', closeBookingModal);
document.getElementById('cancel-modal').addEventListener('click', closeBookingModal);
bookingModal.addEventListener('click', (event) => {
  if (event.target === bookingModal) closeBookingModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !bookingModal.hidden) closeBookingModal();
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const start = formData.get('start');
  const end = formData.get('end');
  const timeSlots = { '08:00': 0, '10:00': 0, '13:30': 1, '15:30': 1, '19:00': 2, '20:30': 2 };
  const endTimes = { '08:00': '10:00', '10:00': '12:00', '13:30': '15:30', '15:30': '17:30', '19:00': '20:30', '20:30': '22:30' };

  if (endTimes[start] !== end) {
    formError.textContent = 'Escolha um periodo valido da grade: inicio e fim devem formar um bloco de aula.';
    return;
  }

  const dayIndex = Number(formData.get('day'));
  const slotIndex = timeSlots[start];
  const cells = document.querySelectorAll('.class-cell');
  const targetCell = cells[slotIndex * 5 + dayIndex];
  const appointment = document.createElement('button');
  appointment.type = 'button';
  appointment.className = 'class-block blue new-appointment';
  appointment.dataset.room = formData.get('room');
  appointment.innerHTML = `<b>${formData.get('className')}</b><small>${start} - ${end} · ${formData.get('room')}</small><i>novo</i>`;
  appointment.addEventListener('click', () => showToast(`${formData.get('className')} · ${formData.get('room')}`));
  enableAppointmentDeletion(appointment, formData.get('className'));
  targetCell.appendChild(appointment);
  closeBookingModal();
  bookingForm.reset();
  showToast('Agendamento criado com sucesso');
});
document.getElementById('today-button').addEventListener('click', () => {
  weekLabel.textContent = '18/08/2026 - 22/08/2026';
  showToast('Semana atual selecionada');
});
document.getElementById('previous-week').addEventListener('click', () => showToast('Semana anterior selecionada'));
document.getElementById('next-week').addEventListener('click', () => showToast('Proxima semana selecionada'));
