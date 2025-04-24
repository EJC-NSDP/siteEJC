
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.PessoaScalarFieldEnum = {
  id: 'id',
  nome: 'nome',
  sobrenome: 'sobrenome',
  celular: 'celular',
  telefone: 'telefone',
  email: 'email',
  createdAt: 'createdAt',
  modifiedAt: 'modifiedAt',
  enderecoCep: 'enderecoCep',
  enderecoNumero: 'enderecoNumero',
  avatarUrl: 'avatarUrl',
  password: 'password',
  changePassword: 'changePassword',
  apelido: 'apelido',
  role: 'role',
  slug: 'slug'
};

exports.Prisma.EncontristaScalarFieldEnum = {
  idPessoa: 'idPessoa',
  endComplemento: 'endComplemento',
  movimentoAnterior: 'movimentoAnterior',
  observacao: 'observacao',
  nomeContato1: 'nomeContato1',
  telContato1: 'telContato1',
  parentescoContato1: 'parentescoContato1',
  nomeContato2: 'nomeContato2',
  telContato2: 'telContato2',
  parentescoContato2: 'parentescoContato2',
  createdAt: 'createdAt',
  modifiedAt: 'modifiedAt',
  indicadoPorApelido: 'indicadoPorApelido',
  indicadoPorEmail: 'indicadoPorEmail',
  indicadoPorNome: 'indicadoPorNome',
  indicadoPorTel: 'indicadoPorTel',
  isAutofill: 'isAutofill',
  idStatus: 'idStatus',
  idReligiao: 'idReligiao',
  idMoracom: 'idMoracom',
  idStatusPais: 'idStatusPais',
  endNumero: 'endNumero',
  cartasFisicas: 'cartasFisicas',
  idCarroEncontro: 'idCarroEncontro',
  cepEncontro: 'cepEncontro',
  endComplementoEncontro: 'endComplementoEncontro',
  endNumEncontro: 'endNumEncontro',
  obsExternaConhecidos: 'obsExternaConhecidos',
  obsExternaLocalizacao: 'obsExternaLocalizacao',
  obsExternaOutros: 'obsExternaOutros',
  obsExternaSaude: 'obsExternaSaude',
  cartasOk: 'cartasOk',
  generosaOk: 'generosaOk',
  familiaOk: 'familiaOk'
};

exports.Prisma.EncontreiroScalarFieldEnum = {
  idPessoa: 'idPessoa',
  dataNasc: 'dataNasc',
  instagram: 'instagram',
  restricaoAlimentar: 'restricaoAlimentar',
  idEncontro: 'idEncontro',
  idCirculo: 'idCirculo',
  idTamanhoCamisa: 'idTamanhoCamisa',
  idDisponibilidade: 'idDisponibilidade',
  obsBanda: 'obsBanda',
  observacoes: 'observacoes',
  statusMontagem: 'statusMontagem'
};

exports.Prisma.EncontroScalarFieldEnum = {
  id: 'id',
  numeroEncontro: 'numeroEncontro',
  idLocal: 'idLocal',
  temaEspiritual: 'temaEspiritual',
  temaFantasia: 'temaFantasia',
  numeroCirculos: 'numeroCirculos',
  dataInicio: 'dataInicio',
  dataTema: 'dataTema',
  createdAt: 'createdAt',
  modifiedAt: 'modifiedAt',
  ordemCirculos: 'ordemCirculos',
  isReceivingCartas: 'isReceivingCartas'
};

exports.Prisma.CirculoScalarFieldEnum = {
  id: 'id',
  idCorCirculo: 'idCorCirculo',
  idTioAparente: 'idTioAparente',
  idTioSecreto: 'idTioSecreto',
  idEncontro: 'idEncontro',
  nome: 'nome'
};

exports.Prisma.EnderecoScalarFieldEnum = {
  cep: 'cep',
  estado: 'estado',
  cidade: 'cidade',
  bairro: 'bairro',
  rua: 'rua',
  createdAt: 'createdAt',
  modifiedAt: 'modifiedAt'
};

exports.Prisma.LocalScalarFieldEnum = {
  id: 'id',
  enderecoCep: 'enderecoCep',
  nomeLocal: 'nomeLocal',
  numeroLocal: 'numeroLocal'
};

exports.Prisma.CarroScalarFieldEnum = {
  id: 'id',
  idMotorista: 'idMotorista',
  modeloCarro: 'modeloCarro',
  placaCarro: 'placaCarro',
  lugaresCarro: 'lugaresCarro',
  observacaoMotorista: 'observacaoMotorista',
  idCarona: 'idCarona'
};

exports.Prisma.CarroEncontroScalarFieldEnum = {
  idCarro: 'idCarro',
  idEncontro: 'idEncontro',
  numeroCarro: 'numeroCarro',
  idExterna: 'idExterna',
  id: 'id',
  observacao: 'observacao'
};

exports.Prisma.ResponsavelExternaScalarFieldEnum = {
  idExterna: 'idExterna',
  idEncontrista: 'idEncontrista',
  idEncontro: 'idEncontro'
};

exports.Prisma.CartaScalarFieldEnum = {
  id: 'id',
  para: 'para',
  de: 'de',
  conteudo: 'conteudo',
  createdAt: 'createdAt',
  slugEncontrista: 'slugEncontrista',
  isPrinted: 'isPrinted'
};

exports.Prisma.ListaPreferenciaScalarFieldEnum = {
  idPessoa: 'idPessoa',
  posicao: 'posicao',
  valueEquipe: 'valueEquipe'
};

exports.Prisma.EquipeEncontroScalarFieldEnum = {
  idPessoa: 'idPessoa',
  idEncontro: 'idEncontro',
  idEquipe: 'idEquipe',
  coordenou: 'coordenou',
  fichaPreenchida: 'fichaPreenchida'
};

exports.Prisma.EquipeMontagemScalarFieldEnum = {
  valueEquipe: 'valueEquipe',
  coordenando: 'coordenando',
  idEncontreiro: 'idEncontreiro'
};

exports.Prisma.DomainStatusScalarFieldEnum = {
  id: 'id',
  status: 'status'
};

exports.Prisma.DomainReligiaoScalarFieldEnum = {
  id: 'id',
  religiao: 'religiao'
};

exports.Prisma.DomainBairroEncontroScalarFieldEnum = {
  id: 'id',
  value: 'value',
  bairro: 'bairro',
  zona: 'zona'
};

exports.Prisma.DomainMoraComScalarFieldEnum = {
  id: 'id',
  moraCom: 'moraCom'
};

exports.Prisma.DomainStatusPaisScalarFieldEnum = {
  id: 'id',
  statusPais: 'statusPais'
};

exports.Prisma.DomainTamanhoCamisaScalarFieldEnum = {
  id: 'id',
  tamanhoCamisa: 'tamanhoCamisa'
};

exports.Prisma.DomainCorCirculoScalarFieldEnum = {
  id: 'id',
  cor: 'cor'
};

exports.Prisma.DomainDisponibilidadeScalarFieldEnum = {
  id: 'id',
  order: 'order',
  disponibilidade: 'disponibilidade',
  descricao: 'descricao'
};

exports.Prisma.DomainEquipesScalarFieldEnum = {
  equipeLabel: 'equipeLabel',
  equipeValue: 'equipeValue',
  pastaUrl: 'pastaUrl'
};

exports.Prisma.AccountScalarFieldEnum = {
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refreshToken: 'refreshToken',
  accessToken: 'accessToken',
  expiresAt: 'expiresAt',
  tokenType: 'tokenType',
  scope: 'scope',
  idToken: 'idToken',
  sessionState: 'sessionState',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SessionScalarFieldEnum = {
  sessionToken: 'sessionToken',
  expires: 'expires',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  ADMIN: 'ADMIN',
  DIRIGENTE: 'DIRIGENTE',
  ENCONTREIRO: 'ENCONTREIRO',
  COORDENADOR: 'COORDENADOR',
  EXTERNA: 'EXTERNA',
  SECRETARIA: 'SECRETARIA',
  ENCONTRISTA: 'ENCONTRISTA',
  TIOEXTERNA: 'TIOEXTERNA',
  TIOSECRETO: 'TIOSECRETO'
};

exports.Value_Status = exports.$Enums.Value_Status = {
  confirmado: 'confirmado',
  confirmado_sem_sexta: 'confirmado_sem_sexta',
  desistiu: 'desistiu',
  ligar: 'ligar',
  lista_espera: 'lista_espera',
  nao_atende: 'nao_atende',
  prox_encontro: 'prox_encontro',
  vai_pensar: 'vai_pensar',
  delete: 'delete'
};

exports.Value_Religiao = exports.$Enums.Value_Religiao = {
  catolica: 'catolica',
  evangelica: 'evangelica',
  espirita: 'espirita',
  matriz_africana: 'matriz_africana',
  judaica: 'judaica',
  nao_tenho: 'nao_tenho',
  outra: 'outra'
};

exports.Value_MoraCom = exports.$Enums.Value_MoraCom = {
  sozinho: 'sozinho',
  conjuge: 'conjuge',
  familiar: 'familiar',
  amigos: 'amigos'
};

exports.Value_StatusPais = exports.$Enums.Value_StatusPais = {
  sim: 'sim',
  nao: 'nao',
  na: 'na'
};

exports.Value_TamanhoCamisa = exports.$Enums.Value_TamanhoCamisa = {
  p: 'p',
  m: 'm',
  g: 'g',
  gg: 'gg',
  xgg: 'xgg',
  outro: 'outro'
};

exports.Value_Disponibilidade = exports.$Enums.Value_Disponibilidade = {
  INDISPONIVEL: 'INDISPONIVEL',
  MUITO_BAIXA: 'MUITO_BAIXA',
  BAIXA: 'BAIXA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  MUITO_ALTA: 'MUITO_ALTA',
  NAO_PREENCHEU: 'NAO_PREENCHEU'
};

exports.StatusEncontreiro = exports.$Enums.StatusEncontreiro = {
  ATIVO: 'ATIVO',
  CONVIDADO_ESPECIAL: 'CONVIDADO_ESPECIAL',
  INATIVO: 'INATIVO'
};

exports.Prisma.ModelName = {
  Pessoa: 'Pessoa',
  Encontrista: 'Encontrista',
  Encontreiro: 'Encontreiro',
  Encontro: 'Encontro',
  Circulo: 'Circulo',
  Endereco: 'Endereco',
  Local: 'Local',
  Carro: 'Carro',
  CarroEncontro: 'CarroEncontro',
  ResponsavelExterna: 'ResponsavelExterna',
  Carta: 'Carta',
  ListaPreferencia: 'ListaPreferencia',
  EquipeEncontro: 'EquipeEncontro',
  EquipeMontagem: 'EquipeMontagem',
  DomainStatus: 'DomainStatus',
  DomainReligiao: 'DomainReligiao',
  DomainBairroEncontro: 'DomainBairroEncontro',
  DomainMoraCom: 'DomainMoraCom',
  DomainStatusPais: 'DomainStatusPais',
  DomainTamanhoCamisa: 'DomainTamanhoCamisa',
  DomainCorCirculo: 'DomainCorCirculo',
  DomainDisponibilidade: 'DomainDisponibilidade',
  DomainEquipes: 'DomainEquipes',
  Account: 'Account',
  Session: 'Session'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
