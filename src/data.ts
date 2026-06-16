import { WorkoutProgram, Testimonial } from './types';

export const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Roberto Mezini',
    age: 34,
    role: 'Executivo de TI',
    beforeWeight: 96,
    afterWeight: 81,
    result: '-15kg de Gordura & Ganho de Massa',
    quote: 'Treinar com o Lucas mudou totalmente minha relação com a saúde. Sendo executivo, meu tempo é escasso. Mas com os treinos eficientes de 45 minutos e foco em biomecânica, tive mais resultados em 6 meses do que em 5 anos me exercitando sozinho.',
    beforeImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80&blur=10', // blurred abstract to simulate before
    afterImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' // sharp handsome after
  },
  {
    id: '2',
    name: 'Carolina Santos',
    age: 28,
    role: 'Arquiteta',
    beforeWeight: 68,
    afterWeight: 59,
    result: 'Firmeza, Definição & Melhora Postural',
    quote: 'Eu sofria com dores terríveis na lombar por causa de horas sentada desenhando. O Lucas adaptou meus treinos totalmente para fortalecimento do core e postura. Hoje tenho zero dores, reduzi meu percentual de gordura e me sinto super forte.',
    beforeImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80&blur=10',
    afterImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    name: 'Bruno Ramos',
    age: 25,
    role: 'Engenheiro Civil',
    beforeWeight: 62,
    afterWeight: 74,
    result: '+12kg de Massa Magra Altamente Definida',
    quote: 'Fui um jovem magro a vida inteira e achava que minha genética nunca permitiria ganhar corpo. Com o planejamento estratégico do Coach Lucas focado em sobrecarga progressiva e nutrição precisa, bati minha meta de peso com grande definição.',
    beforeImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80&blur=10',
    afterImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80'
  }
];

export const workoutTemplates: WorkoutProgram[] = [
  // HIPERTROFIA
  {
    id: 'h_i_superiores',
    name: 'Hipertrofia Iniciante - Superiores',
    description: 'Foco em construir uma base sólida para membros superiores com segurança e controle muscular.',
    level: 'Iniciante',
    goal: 'Hipertrofia',
    focus: 'Membros Superiores',
    exercises: [
      {
        name: 'Supino Vertical na Máquina',
        description: 'Empurre as manoplas para frente, mantendo os cotovelos alinhados e contraindo o peitoral no final.',
        reps: '3 séries de 10-12 reps',
        sets: 3,
        restTime: 60
      },
      {
        name: 'Remada Baixa Sentada (Pegada Neutra)',
        description: 'Puxe as mãos em direção ao umbigo, alongando bem as costas na volta e mantendo a coluna ereta.',
        reps: '3 séries de 12 reps',
        sets: 3,
        restTime: 60
      },
      {
        name: 'Desenvolvimento com Halteres Sentado',
        description: 'Empurre os halteres para cima da cabeça de forma controlada, mantendo o abdômen firme.',
        reps: '3 séries de 10 reps',
        sets: 3,
        restTime: 60
      },
      {
        name: 'Rosca Direta Polia Baixa',
        description: 'Flexione os cotovelos trazendo a barra ao peito, sem movimentar os ombros nem balançar o tronco.',
        reps: '3 séries de 12-15 reps',
        sets: 3,
        restTime: 45
      },
      {
        name: 'Tríceps Corda na Polia Alta',
        description: 'Estenda totalmente os cotovelos empurrando a corda para baixo, abrindo as pontas no final.',
        reps: '3 séries de 12-15 reps',
        sets: 3,
        restTime: 45
      }
    ]
  },
  {
    id: 'h_a_superiores',
    name: 'Hipertrofia Avançado - Full Upper',
    description: 'Técnica de sobrecarga progressiva intensa, focada em fadiga excêntrica e volume otimizado.',
    level: 'Avançado',
    goal: 'Hipertrofia',
    focus: 'Membros Superiores',
    exercises: [
      {
        name: 'Supino Inclinado com Halteres',
        description: 'Mantenha as escápulas aduzidas e desça os halteres de forma bem lenta (cadência de 4 segundos na descida).',
        reps: '4 séries de 8-10 reps (Última drop-set)',
        sets: 4,
        restTime: 90
      },
      {
        name: 'Barra Fixa com Carga Extra',
        description: 'Tração completa até passar o queixo da barra, controlando a descida ao máximo.',
        reps: '4 séries de reps máximas (mínimo 6)',
        sets: 4,
        restTime: 90
      },
      {
        name: 'Desenvolvimento Militar com Barra',
        description: 'De pé, empurre a barra olímpica verticalmente mantendo as pernas e core totalmente enrijecidos.',
        reps: '4 séries de 6-8 reps',
        sets: 4,
        restTime: 90
      },
      {
        name: 'Remada Curvada com Barra (Pegada Supinada)',
        description: 'Tronco inclinado a 45 graus, puxe a barra rente às coxas até tocar a linha do abdômen inferior.',
        reps: '4 séries de 8-10 reps',
        sets: 4,
        restTime: 75
      },
      {
        name: 'Bíceps Rosca Alternada Inclinada (Banco 45°)',
        description: 'Grande alongamento da cabeça longa do bíceps. Suba girando o punho e esmagando o pico de contração.',
        reps: '3 séries de 10-12 reps',
        sets: 3,
        restTime: 60
      },
      {
        name: 'Tríceps Testa com Barra W',
        description: 'Deitado no banco plano, flexione apenas os cotovelos descendo a barra em direção à sua testa.',
        reps: '3 séries de 10-12 reps',
        sets: 3,
        restTime: 60
      }
    ]
  },
  {
    id: 'h_i_inferiores',
    name: 'Hipertrofia Iniciante - Pernas Fortes',
    description: 'Exercícios multiarticulares coordenados para pernas simétricas e articulações protegidas.',
    level: 'Iniciante',
    goal: 'Hipertrofia',
    focus: 'Membros Inferiores',
    exercises: [
      {
        name: 'Leg Press 45 Graus',
        description: 'Pressione com toda a sola do pé, descendo o carrinho de forma segura sem descolar o quadril do encosto.',
        reps: '3 séries de 12 reps',
        sets: 3,
        restTime: 75
      },
      {
        name: 'Cadeira Extensora',
        description: 'Estenda as pernas totalmente contraindo o quadríceps, segure 1 segundo em cima e desça devagar.',
        reps: '3 séries de 12-15 reps',
        sets: 3,
        restTime: 60
      },
      {
        name: 'Mesa Flexora',
        description: 'Deitado de bruços, flexione totalmente os joelhos para trabalhar a porção posterior da coxa.',
        reps: '3 séries de 12 reps',
        sets: 3,
        restTime: 60
      },
      {
        name: 'Gêmeos Sentado na Máquina',
        description: 'Calcanhares descem todo o percurso para um alongamento completo da panturrilha e sobem explodindo no pico.',
        reps: '4 séries de 15 reps',
        sets: 4,
        restTime: 45
      }
    ]
  },
  {
    id: 'h_a_inferiores',
    name: 'Hipertrofia Avançado - Pernas de Ferro',
    description: 'Aniquilação de membros inferiores com foco em agachamento profundo e grandes tensões metabólicas.',
    level: 'Avançado',
    goal: 'Hipertrofia',
    focus: 'Membros Inferiores',
    exercises: [
      {
        name: 'Agachamento Livre Olímpico',
        description: 'Agache abaixo do paralelo (90°)+ respeitando a curvatura lombar. Suba recrutando glúteos e quadríceps.',
        reps: '4 séries de 6-8 reps pesadas',
        sets: 4,
        restTime: 120
      },
      {
        name: 'Stiff com Barra Olímpica',
        description: 'Estenda bem o quadril para trás mantendo os joelhos semi-flexionados para alongamento máximo dos isquiotibiais.',
        reps: '4 séries de 10 reps',
        sets: 4,
        restTime: 90
      },
      {
        name: 'Afundo Caminhando com Halteres',
        description: 'Dê passadas largas descendo o joelho de trás até quase tocar o solo, projetando a força na perna da frente.',
        reps: '3 séries de 20 passos no total',
        sets: 3,
        restTime: 75
      },
      {
        name: 'Cadeira Flexora (Rest-Pause)',
        description: 'Faça 10 reps, descanse 10 segundos, faça o máximo de reps adicionais, repita mais uma vez.',
        reps: '3 séries de 10-12 + RP',
        sets: 3,
        restTime: 75
      },
      {
        name: 'Panturrilha em Pé (Smith Machine)',
        description: 'Grande alongamento, explosão na subida e descida cadenciada suportando alta carga.',
        reps: '4 séries de 12-15 reps pesadas',
        sets: 4,
        restTime: 60
      }
    ]
  },

  // EMAGRECIMENTO & DEFINIÇÃO
  {
    id: 'e_int_corpotodo',
    name: 'Definição Total - Metabolic Full Body',
    description: 'Circuito metabólico focado em queima de gordura e tonificação muscular geral, mantendo a frequência cardíaca elevada.',
    level: 'Intermediário',
    goal: 'Emagrecimento',
    focus: 'Corpo Inteiro',
    exercises: [
      {
        name: 'Agachamento com Halteres + Desenvolvimento',
        description: 'Agache segurando os halteres nos ombros e, ao subir, empurre-os direto acima da cabeça em um único movimento.',
        reps: '3 séries de 15 reps',
        sets: 3,
        restTime: 45
      },
      {
        name: 'Push-ups (Flexões de Braço)',
        description: 'Flexões no chão mantendo o corpo perfeitamente alinhado. Apoie os joelhos se necessário.',
        reps: '3 séries de 15 reps',
        sets: 3,
        restTime: 45
      },
      {
        name: 'Kettlebell Swing',
        description: 'Projete o kettlebell elevando-o até a altura do peito, jogando a força no quadril e glúteos e contraindo o abdômen.',
        reps: '3 séries de 20 reps',
        sets: 3,
        restTime: 45
      },
      {
        name: 'Remada Pulley Articulada',
        description: 'Puxe firme sentindo as escápulas retraindo, ativando bastante as costas.',
        reps: '3 séries de 15 reps',
        sets: 3,
        restTime: 45
      },
      {
        name: 'Burpees Metabólicos',
        description: 'Desça deitando o peito no chão, suba jogando os pés embaixo do corpo e execute um salto vertical vigoroso.',
        reps: '3 séries de 10-12 reps',
        sets: 3,
        restTime: 60
      },
      {
        name: 'Prancha Abdominal Dinâmica (Spider)',
        description: 'Em prancha alta, traga o joelho direito em rotação externa até o cotovelo direito. Alterne vigorosamente.',
        reps: '3 séries de 45 segundos',
        sets: 3,
        restTime: 45
      }
    ]
  },

  // RESISTÊNCIA & CARDIO
  {
    id: 'r_i_cardio',
    name: 'Resistência Geral - Cardio Express',
    description: 'Treino aeróbico de baixo impacto focado em resistência cardiovascular e queima calórica sem sobrecarga articular.',
    level: 'Iniciante',
    goal: 'Resistência',
    focus: 'Cardio / Funcional',
    exercises: [
      {
        name: 'Polichinelos Clássicos',
        description: 'Movimentos rítmicos coordenando a abertura rápida das pernas com o aplauso sobre a cabeça.',
        reps: '4 séries de 45 segundos',
        sets: 4,
        restTime: 30
      },
      {
        name: 'Escalada na Prancha (Mountain Climbers)',
        description: 'Apoie as mãos no chão e traga os joelhos em direção ao peito de forma alternada e rápida.',
        reps: '4 séries de 30 segundos',
        sets: 4,
        restTime: 30
      },
      {
        name: 'Agachamento Livre com Salto',
        description: 'Agache de forma rasa e exploda no ar amortecendo perfeitamente na ponta dos pés na descida.',
        reps: '3 séries de 12-15 reps',
        sets: 3,
        restTime: 45
      },
      {
        name: 'Corrida Estacionária no Lugar',
        description: 'Simulação de corrida elevando bem os joelhos, contraindo o core constantemente.',
        reps: '4 séries de 60 segundos',
        sets: 4,
        restTime: 30
      }
    ]
  },
  {
    id: 'r_a_cardio',
    name: 'Condicionamento Elite - Funcional HIIT',
    description: 'HIIT de altíssimo nível para atletas que buscam capacidade pulmonar máxima e quebra de platôs físicos.',
    level: 'Avançado',
    goal: 'Resistência',
    focus: 'Cardio / Funcional',
    exercises: [
      {
        name: 'Salto sobre Caixa Box (Box Jumps)',
        description: 'Flexione as pernas e salte em cima de uma caixa firme, estendendo completamente o quadril em cima antes de descer.',
        reps: '4 séries de 12 saltos',
        sets: 4,
        restTime: 45
      },
      {
        name: 'Burpee Reverso com Salto em Altura',
        description: 'Deite-se no chão totalmente de costas, role levantando de uma vez usando o momentum das pernas e exploda no salto.',
        reps: '4 séries de 10 reps',
        sets: 4,
        restTime: 60
      },
      {
        name: 'Abdominal Remador Explosivo',
        description: 'Perfeitamente estendido deitado, suba abraçando os جوelhos com força máxima e retorne controladamente.',
        reps: '4 séries de 25 reps',
        sets: 4,
        restTime: 30
      },
      {
        name: 'Salto Patinador (Skater Jumps)',
        description: 'Saltos amplos e velozes para o lado abrindo braços de apoio, amortecendo em um pé só, com agilidade atlética.',
        reps: '4 séries de 45 segundos',
        sets: 4,
        restTime: 30
      },
      {
        name: 'Prancha com Toque nos Ombros (Veloz)',
        description: 'Posição estável sem mexer o quadril, toque as mãos alternadamente nos ombros garantindo postura impecável.',
        reps: '4 séries de 60 segundos',
        sets: 4,
        restTime: 30
      }
    ]
  }
];

export const mockDefaultWorkout: WorkoutProgram = {
  id: 'custom_default',
  name: 'Seu Treino Sob Medida',
  description: 'Selecione abaixo o seu nível, foco e objetivo para o Coach Lucas gerar seu roteiro de exercícios exclusivo!',
  level: 'Iniciante',
  goal: 'Hipertrofia',
  focus: 'Corpo Inteiro',
  exercises: [
    {
      name: 'Agachamento Livre (Peso Corporal)',
      description: 'Mantenha os calcanhares no chão, abra o peito e agache até os joelhos ficarem a 90 graus.',
      reps: '4 séries de 15 reps',
      sets: 4,
      restTime: 60
    },
    {
      name: 'Flexão de Braço (Polia ou Chão)',
      description: 'Mantenha o corpo como uma tábua sólida, desça o tronco suavemente e empurre de volta.',
      reps: '3 séries de 12 reps',
      sets: 3,
      restTime: 60
    },
    {
      name: 'Abdominal Infra',
      description: 'Deitado de costas, eleve os joelhos flexionados a 90° em direção ao quadril de maneira coordenada.',
      reps: '3 séries de 15-20 reps',
      sets: 3,
      restTime: 45
    }
  ]
};

// Simple utility to find or compile a dynamic routine if specific template isn't found
export function getCustomRoutine(goal: string, focus: string, level: 'Iniciante' | 'Intermediário' | 'Avançado'): WorkoutProgram {
  const match = workoutTemplates.find(
    program => program.goal === goal && program.level === level && (program.focus === focus || focus === 'Corpo Inteiro')
  );
  
  if (match) {
    return match;
  }
  
  // Return closely matched or build a smart one online
  const generalMatches = workoutTemplates.filter(program => program.level === level || program.goal === goal);
  if (generalMatches.length > 0) {
    // Return first best guess
    return {
      ...generalMatches[0],
      name: `Treino Customizado: ${goal} - ${focus} (${level})`,
      goal,
      focus,
      level,
    };
  }
  
  return {
    ...mockDefaultWorkout,
    name: `Plano Elite: ${goal} (${level})`,
    goal,
    focus,
    level
  };
}
