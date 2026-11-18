const salas = [
  { id: 'Sala A', nome: 'Sala A', andar: 1, capacidade: 40, recursos: ['20 computadores', 'projetor', 'ar-condicionado', 'quadro branco'] },
  { id: 'Sala B', nome: 'Sala B', andar: 1, capacidade: 30, recursos: ['projetor', 'TV', 'ar-condicionado', 'quadro branco'] },
  { id: 'Sala C', nome: 'Sala C', andar: 2, capacidade: 60, recursos: ['30 computadores', 'projetor', 'caixas de som', 'ar-condicionado'] }
];

const reservas = [
  { salaId: 'Sala A', data: '2026-11-23', inicio: '08:00', fim: '10:00', responsavel: 'Ana', finalidade: 'Aula de lógica', situacao: 'aprovada' },
  { salaId: 'Sala A', data: '2026-11-23', inicio: '10:00', fim: '12:00', responsavel: 'Bruno', finalidade: 'Oficina de algoritmos', situacao: 'pendente' },
  { salaId: 'Sala B', data: '2026-11-23', inicio: '13:30', fim: '15:30', responsavel: 'Carla', finalidade: 'Reunião pedagógica', situacao: 'cancelada' },
  { salaId: 'Sala C', data: '2026-11-24', inicio: '19:00', fim: '20:30', responsavel: 'Diego', finalidade: 'Aula de redes', situacao: 'aprovada' },
  { salaId: 'Sala B', data: '2026-11-25', inicio: '15:30', fim: '17:30', responsavel: 'Elisa', finalidade: 'Apresentação de projetos', situacao: 'pendente' }
];

// Horários no formato HH:mm podem ser comparados diretamente.
function horariosConflitam(primeiro, segundo) {
  return primeiro.inicio < segundo.fim && segundo.inicio < primeiro.fim;
}

function existeConflito(novaReserva, reservas) {
  return novaReserva.situacao !== 'cancelada' && reservas.some((reserva) =>
    reserva.situacao !== 'cancelada' &&
    reserva.salaId === novaReserva.salaId &&
    reserva.data === novaReserva.data &&
    horariosConflitam(novaReserva, reserva)
  );
}

function cabeNaSala(quantidadeAlunos, salaId, salas) {
  const sala = salas.find((sala) => sala.id === salaId);
  return sala !== undefined &&
    Number.isInteger(quantidadeAlunos) &&
    quantidadeAlunos >= 0 &&
    quantidadeAlunos <= sala.capacidade;
}
