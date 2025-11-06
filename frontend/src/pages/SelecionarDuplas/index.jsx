import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const JogadorSlot = ({ player, onRemove, teamColor }) => {
  if (!player) {
    return (
      <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg text-gray-500 text-lg">
        Jogador Vazio
      </div>
    );
  }

  return (
    <div className={`h-24 flex items-center justify-center rounded-lg text-white font-bold text-lg relative ${teamColor}`}>
      {player.nome_atleta}
      <button
        onClick={onRemove}
        className="absolute top-1 right-2 text-white/70 hover:text-white font-bold text-xl"
        aria-label={`Remover ${player.nome_atleta}`}
      >
        &times;
      </button>
    </div>
  );
};

const AddJogadorModal = ({ isOpen, onClose, onSave }) => {
  const [nome, setNome] = useState('');
  const [altura, setAltura] = useState('');
  const [idade, setIdade] = useState('');

  const handleSave = () => {
    if (!nome.trim()) {
      alert('O nome/apelido é obrigatório.');
      return;
    }
    onSave({
      nome_atleta: nome,
      altura: altura ? parseInt(altura, 10) : null,
      idade: idade ? parseInt(idade, 10) : null,
    });

    setNome('');
    setAltura('');
    setIdade('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6">
        <h3 className="text-2xl font-bold text-white">Cadastrar Novo Jogador</h3>
        <div>
          <label htmlFor="novo-jogador-nome" className="block mb-2 text-sm font-medium text-gray-300">Nome / Apelido <span className="text-red-400">*</span></label>
          <input
            type="text"
            id="novo-jogador-nome"
            value={nome} onChange={(e) => setNome(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            placeholder="Ex: João"
          />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} className="btn-primary">Salvar Jogador</button>
        </div>
      </div>
    </div>
  );
};


function SelecionarDuplas() {
  const [allPlayers, setAllJogadores] = useState([]);
  const [duplaA, setDuplaA] = useState([null, null]);
  const [duplaB, setDuplaB] = useState([null, null]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const nomePartida = location.state?.nomePartida || "Partida Sem Nome";

  console.log("Nome da Partida recebida:", nomePartida);

  const fetchJogadores = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/atletas');
      setAllJogadores(response.data);
      console.log("Jogadores carregados!");
    } catch (error) {
      console.error("Erro ao buscar jogadores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJogadores();
  }, []);


  const handleSalvarNovoJogador = async (JogadorData) => {
    console.log("Enviando novo jogador para a API...", JogadorData);
    try {
      const response = await api.post('/atletas', JogadorData);
      console.log("Jogador salvo com sucesso:", response.data);
      await fetchJogadores();
    } catch (error) {
      console.error("Erro ao salvar novo jogador:", error);
      alert("Não foi possível salvar o jogador. Verifique o console para mais detalhes.");
    }
  };



  const selectedJogadoresIds = new Set([...duplaA, ...duplaB].filter(Boolean).map(p => p.atleta_id));
  const jogadoresDisponiveis = allPlayers.filter(p => !selectedJogadoresIds.has(p.atleta_id));

  const handleSelecionarJogador = (player) => {
    const novaDuplaA = [...duplaA];
    const slotVazioA = novaDuplaA.indexOf(null);
    if (slotVazioA !== -1) {
      novaDuplaA[slotVazioA] = player;
      setDuplaA(novaDuplaA);
      return;
    }

    const novaDuplaB = [...duplaB];
    const emptySlotB = novaDuplaB.indexOf(null);
    if (emptySlotB !== -1) {
      novaDuplaB[emptySlotB] = player;
      setDuplaB(novaDuplaB);
    }
  };

  const handleRemoveJogador = (team, index) => {
    if (team === 'A') {
      const novaDuplaA = [...duplaA];
      novaDuplaA[index] = null;
      setDuplaA(novaDuplaA);
    } else {
      const novaDuplaB = [...duplaB];
      novaDuplaB[index] = null;
      setDuplaB(novaDuplaB);
    }
  };

  const resetDuplas = () => {
    setDuplaA([null, null]);
    setDuplaB([null, null]);
  };

  const isMatchReady = duplaA.every(Boolean) && duplaB.every(Boolean);

  const handleIniciarPartida = async () => {

    if (!isMatchReady) return;

    try {
      console.log("Cadastrando partida na APi, duplas:", { duplaA, duplaB });
      // Parei aqui ------> RESOLVENDO API
      const resposta = await api.post('/partidas/com-atletas', {
        nome_partida: nomePartida,
        atleta_dupla_a1_id: duplaA[0].atleta_id,
        atleta_dupla_a2_id: duplaA[1].atleta_id,
        atleta_dupla_b1_id: duplaB[0].atleta_id,
        atleta_dupla_b2_id: duplaB[1].atleta_id,
      });
      console.log("Partida iniciada com sucesso:", resposta.data);

      navigate('/partida', {
        state: { duplas: { a1: duplaA[0], a2: duplaA[1], b1: duplaB[0], b2: duplaB[1] }, partida: resposta.data }
      });

    } catch (error) {
      console.error("Erro ao iniciar partida:", error);
    }

  };

  return (
    <div className="flex flex-col p-4 md:p-8 h-full">
      <AddJogadorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvarNovoJogador}
      />

      <h2 className="text-3xl font-bold text-center mb-6 text-white">Seleção de Duplas</h2>

      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="flex flex-col bg-[#1E1E1E] p-4 rounded-lg">
          <h3 className="text-2xl font-semibold text-blue-400 mb-4 text-center">Dupla A</h3>
          <div className="w-full space-y-4">
            <JogadorSlot player={duplaA[0]} onRemove={() => handleRemoveJogador('A', 0)} teamColor="bg-blue-600" />
            <JogadorSlot player={duplaA[1]} onRemove={() => handleRemoveJogador('A', 1)} teamColor="bg-blue-600" />
          </div>
        </div>

        <div className="flex flex-col bg-[#2a2a2a] p-4 rounded-lg">
          <h3 className="text-2xl font-semibold text-center mb-4">Jogadores Disponíveis</h3>
          {isLoading ? (
            <div className="flex items-center justify-center text-gray-400 h-[300px]">Carregando...</div>
          ) : (
            <div className="space-y-2 overflow-y-auto pr-2 max-h-[300px] md:max-h-[400px]">
              {jogadoresDisponiveis.map(player => (
                <div
                  key={player.atleta_id}
                  onClick={() => handleSelecionarJogador(player)}
                  className="p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-blue-500 transition-colors text-center text-base"
                >
                  {player.nome_atleta}
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setIsModalOpen(true)} className="mt-4 w-full text-center bg-gray-700 text-gray-200 font-semibold py-3 px-6 rounded-lg text-base hover:bg-gray-600">
            + Cadastrar Novo Jogador
          </button>
        </div>

        <div className="flex flex-col bg-[#1E1E1E] p-4 rounded-lg">
          <h3 className="text-2xl font-semibold text-red-400 mb-4 text-center">Dupla B</h3>
          <div className="w-full space-y-4">
            <JogadorSlot player={duplaB[0]} onRemove={() => handleRemoveJogador('B', 0)} teamColor="bg-red-600" />
            <JogadorSlot player={duplaB[1]} onRemove={() => handleRemoveJogador('B', 1)} teamColor="bg-red-600" />
          </div>
        </div>
      </main>

      <footer className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={resetDuplas}
          className="bg-transparent border-2 border-gray-600 hover:bg-gray-700 text-gray-200 font-bold uppercase py-3 px-6 rounded-lg transition-colors"
        >
          Resetar
        </button>
        <button
          id="btn-iniciar-partida"
          className="bg-[#00a2ffdc] hover:bg-[#0082cc] font-bold uppercase text-white py-3 px-6 rounded-lg transition-colors shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={!isMatchReady}
          onClick={handleIniciarPartida}
        >
          INICIAR PARTIDA
        </button>
      </footer>
    </div>
  );
}

export default SelecionarDuplas;
