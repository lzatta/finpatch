import { Trophy, Flame, ShieldCheck, PlusCircle, ArrowRightLeft, Target } from 'lucide-react';
import { Challenge, Achievement, Account, RankingUser } from './types';

// --- CHALLENGES ---
export const mockWeeklyChallenges: Challenge[] = [
  { id: 'w1', title: 'Semana sem iFood', description: 'Cozinhe em casa e economize.', xp: 150, progress: 3, total: 7, isWeekly: true, isAIGenerated: true, difficulty: 'Médio', category: 'Economia' },
  { id: 'w2', title: 'Aporte Extra', description: 'Aporte R$ 100 em uma de suas metas.', xp: 100, progress: 0, total: 1, isWeekly: true, difficulty: 'Fácil', category: 'Investimento' },
  { id: 'w3', title: 'Revisão de Orçamento', description: 'Categorize todas as transações da semana.', xp: 200, progress: 1, total: 1, isWeekly: true, difficulty: 'Médio', category: 'Organização' },
];

export const mockAvailableChallenges: Challenge[] = [
    { id: 'a1', title: 'Mestre da Poupança', description: 'Economize 20% do seu salário por 3 meses.', xp: 1000, progress: 0, total: 3, difficulty: 'Difícil', category: 'Economia' },
    { id: 'a2', title: 'Investidor Iniciante', description: 'Faça seu primeiro investimento na bolsa.', xp: 300, progress: 0, total: 1, difficulty: 'Médio', category: 'Investimento' },
    { id: 'a3', title: 'Orçamento Zen', description: 'Passe um mês inteiro sem exceder nenhuma categoria do seu orçamento.', xp: 750, progress: 0, total: 1, difficulty: 'Difícil', category: 'Organização' },
];

// --- RANKINGS & FAMILY ---
export const mockFamilyMembers: RankingUser[] = [
  { id: 'u1', name: 'Você', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', xp: 2350, level: 5, isCurrentUser: true, streak: 5, role: 'Admin', weeklySavings: 350.50, totalExpenses: 3200 },
  { id: 'u2', name: 'Ana Silva', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', xp: 2100, level: 5, isCurrentUser: false, streak: 3, role: 'Membro', weeklySavings: 280.00, totalExpenses: 2820 },
  { id: 'u3', name: 'Carlos Silva', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', xp: 1500, level: 4, isCurrentUser: false, streak: 8, role: 'Membro', weeklySavings: 150.75, totalExpenses: 2400 },
];
export const mockFamilyRanking = mockFamilyMembers;

export const mockFamilyAchievements = [
    { icon: Trophy, text: "Primeira meta em grupo!" },
    { icon: Flame, text: "100 dias de economia" },
    { icon: ShieldCheck, text: "Reserva de emergência OK" },
];

export const mockFamilySavingsEvolution = [
    { month: "Jan", savings: 1200 },
    { month: "Fev", savings: 1800 },
    { month: "Mar", savings: 1500 },
    { month: "Abr", savings: 2500 },
    { month: "Mai", savings: 2200 },
    { month: "Jun", savings: 3100 },
];

export const mockFamilyActivityFeed = [
    { id: 'fa1', memberId: 'u2', memberName: 'Ana Silva', memberAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', action: 'adicionou R$ 300 à meta "Apartamento"', timestamp: 'Há 2 horas', icon: PlusCircle },
    { id: 'fa2', memberId: 'u3', memberName: 'Carlos Silva', memberAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', action: 'registrou um gasto de R$ 80 em "Lazer"', timestamp: 'Há 5 horas', icon: ArrowRightLeft },
    { id: 'fa3', memberId: 'u1', memberName: 'Você', memberAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', action: 'concluiu o desafio "Semana sem iFood"', timestamp: 'Ontem', icon: Trophy },
    { id: 'fa4', memberId: 'u2', memberName: 'Ana Silva', memberAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', action: 'criou a meta "Curso de Inglês"', timestamp: '2 dias atrás', icon: Target },
];


// --- ACHIEVEMENTS ---
export const mockAchievements: Achievement[] = [
  { id: 'ac1', name: 'Primeiro Passo', description: 'Criou sua primeira meta.', unlocked: true, rarity: 'common', unlockedDate: '2025-01-15' },
  { id: 'ac2', name: 'Poupador', description: 'Alcançou R$ 1.000 em uma meta.', unlocked: true, rarity: 'uncommon', unlockedDate: '2025-03-20' },
  { id: 'ac3', name: 'Meta Concluída!', description: 'Concluiu sua primeira meta.', unlocked: true, rarity: 'rare', unlockedDate: '2025-07-01' },
  { id: 'ac4', name: 'Investidor', description: 'Fez seu primeiro investimento.', unlocked: false, rarity: 'rare', progress: 0 },
  { id: 'ac5', name: 'Mestre das Finanças', description: 'Alcançou Nível 10.', unlocked: false, rarity: 'epic', progress: 50 },
  { id: 'ac6', name: 'Lendário', description: 'Alcançou R$ 100.000 em patrimônio.', unlocked: false, rarity: 'legendary', progress: 12 },
];


// --- ACCOUNTS ---
export const mockAccounts: Account[] = [
  { id: 'acc1', name: 'Conta Corrente', bank: 'Nubank', balance: 8430.22, type: 'checking', status: 'connected', lastSync: 'Hoje, às 14:30' },
  { id: 'acc2', name: 'Poupança', bank: 'Itaú', balance: 25000.00, type: 'savings', status: 'syncing', lastSync: 'Ontem, às 09:00' },
  { id: 'acc3', name: 'Investimentos', bank: 'Bradesco', balance: 52340.80, type: 'investment', status: 'error', lastSync: '2 dias atrás' },
];
