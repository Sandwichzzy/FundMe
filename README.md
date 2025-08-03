# FundMe - 智能合约众筹平台

一个基于以太坊的去中心化众筹平台，支持时间窗口控制、目标金额验证、自动退款机制和 ERC20 代币集成。

## 🚀 项目概述

FundMe 是一个完整的智能合约众筹解决方案，具有以下核心特性：

- **⏰ 时间窗口控制**: 支持设置众筹期限，到期后自动关闭投资
- **💰 目标金额验证**: 基于 Chainlink 价格预言机实时计算 USD 价值
- **🔒 权限管理**: 仅合约所有者可以提取达到目标的资金
- **💸 自动退款**: 未达到目标时投资者可申请退款
- **🪙 ERC20 代币集成**: 支持代币奖励和销毁机制
- **📊 完整测试覆盖**: 包含全面的单元测试和集成测试

## 🏗️ 项目架构

### 智能合约结构

```
contracts/
├── FundMe.sol                    # 主合约 - 众筹核心逻辑
├── FundTokenERC20.sol           # ERC20 代币合约 - 奖励代币
└── mocks/
    └── MockV3Aggregator.sol     # Chainlink 价格预言机模拟
```

### 核心合约功能

#### FundMe.sol - 主合约

- **投资功能** (`fund()`): 接收 ETH 投资，验证金额和时间窗口
- **资金提取** (`getFund()`): 所有者提取达到目标的资金
- **退款机制** (`refund()`): 投资者申请退款
- **所有权管理** (`transferOwnership()`): 转移合约所有权
- **ERC20 集成** (`setErc20Addr()`): 设置代币合约地址

#### FundTokenERC20.sol - 代币合约

- **代币铸造** (`mint()`): 基于投资金额铸造代币
- **代币销毁** (`claim()`): 使用后销毁代币
- **权限控制**: 仅 FundMe 合约可调用特定功能

## 📋 核心参数配置

| 参数                  | 值       | 说明         |
| --------------------- | -------- | ------------ |
| `MINIMUM_VALUE`       | 100 USD  | 最低投资金额 |
| `TARGET`              | 1000 USD | 众筹目标金额 |
| `LOCK_TIME`           | 300 秒   | 众筹时间窗口 |
| `CONFIRMATION_BLOCKS` | 5        | 确认区块数   |

## 🛠️ 技术栈

- **开发框架**: Hardhat
- **智能合约**: Solidity 0.8.20
- **测试框架**: Mocha + Chai
- **价格预言机**: Chainlink AggregatorV3
- **代币标准**: ERC20 (OpenZeppelin)
- **网络支持**: 以太坊主网/测试网

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn
- Git

### 安装依赖

```bash
git clone <repository-url>
cd FundMe
npm install
```

### 环境变量配置

创建 `.env` 文件并配置以下变量：

```env
# Alchemy API 密钥 (用于 Sepolia 测试网)
ALCHEMY_API_KEY=your_alchemy_api_key

# 私钥配置 (不要包含 0x 前缀)
PRIVATE_KEY=your_private_key
PRIVATE_KEY_2=your_second_private_key
PRIVATE_KEY_3=your_third_private_key

# Etherscan API 密钥 (用于合约验证)
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 编译合约

```bash
npx hardhat compile
```

### 运行测试

```bash
# 使用内置网络测试 (推荐)
npx hardhat test

# 使用本地节点测试
npx hardhat node
npx hardhat test --network local

# 使用 Sepolia 测试网
npx hardhat test --network sepolia
```

### 部署合约

```bash
# 部署到本地网络
npx hardhat deploy --network local

# 部署到 Sepolia 测试网
npx hardhat deploy --network sepolia
```

## 📝 使用指南

### 1. 众筹投资流程

```javascript
// 1. 投资 ETH (需要满足最低金额要求)
await fundMe.fund({ value: ethers.parseEther("0.05") });

// 2. 查看投资记录
const balance = await fundMe.fundersToAmount(investorAddress);
```

### 2. 资金提取流程

```javascript
// 仅合约所有者可调用，需要满足条件：
// - 投资窗口已关闭
// - 达到目标金额
await fundMe.getFund();
```

### 3. 退款流程

```javascript
// 投资者可调用，需要满足条件：
// - 投资窗口已关闭
// - 未达到目标金额
// - 有投资记录
await fundMe.refund();
```

### 4. 代币操作

```javascript
// 铸造代币 (基于投资金额)
await fundToken.mint(amountToMint);

// 销毁代币 (使用后)
await fundToken.claim(amountToClaim);
```

## 🧪 测试覆盖

项目包含完整的测试用例：

### 投资功能测试

- ✅ 投资窗口关闭时投资失败
- ✅ 投资金额不足时投资失败
- ✅ 正常投资成功

### 资金提取测试

- ✅ 非所有者提取失败
- ✅ 窗口未关闭时提取失败
- ✅ 未达到目标时提取失败
- ✅ 条件满足时提取成功

### 退款功能测试

- ✅ 窗口未关闭时退款失败
- ✅ 达到目标时退款失败
- ✅ 无投资记录时退款失败
- ✅ 条件满足时退款成功

## 🔧 自定义任务

项目提供了便捷的 Hardhat 任务：

### 部署任务

```bash
npx hardhat deploy-fundme --network sepolia
```

### 交互任务

```bash
npx hardhat interact-fundme --addr <contract-address>
```

## 🌐 网络配置

### 支持的网络

| 网络      | 用途     | 特点                     |
| --------- | -------- | ------------------------ |
| `hardhat` | 开发测试 | 内存区块链，快速测试     |
| `local`   | 本地开发 | 持久化数据，真实环境模拟 |
| `sepolia` | 测试网   | 真实测试网络             |

### 网络配置示例

```javascript
// hardhat.config.js
networks: {
  hardhat: {
    chainId: 31337,
  },
  sepolia: {
    url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 11155111,
  },
}
```

## 📊 事件系统

合约定义了以下事件用于前端监听：

```solidity
event FundWithdrawByOwner(uint256 amount);
event RefundByFunder(address funder, uint256 amount);
```

## 🔒 安全特性

- **重入攻击防护**: 使用 `call` 方法进行 ETH 转账
- **权限控制**: 修饰符确保函数调用权限
- **时间窗口**: 防止过期操作
- **金额验证**: 基于实时价格预言机验证

## 🐛 故障排除

### 常见问题

1. **连接超时错误**

   ```bash
   # 检查网络连接和 API 密钥
   # 尝试使用本地网络测试
   npx hardhat test --network local
   ```

2. **Gas 费用不足**

   ```bash
   # 确保账户有足够的 ETH
   # 检查网络配置
   ```

3. **合约验证失败**
   ```bash
   # 检查构造函数参数
   # 确保网络和地址正确
   ```

### 调试技巧

```bash
# 启用详细日志
npx hardhat test --verbose

# 查看 Gas 使用情况
REPORT_GAS=true npx hardhat test
```

## 📄 许可证

MIT License

**注意**: 这是一个演示项目，在生产环境中使用前请进行充分的安全审计。
