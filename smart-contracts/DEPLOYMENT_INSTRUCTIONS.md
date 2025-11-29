# Deployment Instructions - World Chain Mainnet

## Pre-requisitos ✅
- [x] Foundry instalado (forge v1.5.0)
- [x] Librerías instaladas (OpenZeppelin, forge-std)
- [x] Contratos compilados exitosamente
- [x] World ID Router address confirmada: `0x17B354dD2595411ff79041f930e491A4Df39A278`

## Paso 1: Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita el archivo `.env` y reemplaza `your_private_key_here` con tu private key real (sin el prefijo 0x)

⚠️ **IMPORTANTE**: Nunca compartas tu private key. El archivo `.env` debe estar en `.gitignore`

## Paso 2: Verificar Fondos

Asegúrate de que tu wallet tenga suficiente ETH en World Chain Mainnet para cubrir el gas del deployment.

## Paso 3: Deployment a World Chain Mainnet

### Opción 1: Deploy con script (Recomendado)

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $WORLDCHAIN_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  -vvvv
```

### Opción 2: Deploy manual de cada contrato

Si prefieres mayor control, puedes desplegar cada contrato individualmente:

```bash
# 1. Deploy VowNFT
forge create src/VowNFT.sol:VowNFT \
  --rpc-url https://rpc.worldchain.org \
  --private-key $PRIVATE_KEY

# 2. Deploy MilestoneNFT
forge create src/MilestoneNFT.sol:MilestoneNFT \
  --rpc-url https://rpc.worldchain.org \
  --private-key $PRIVATE_KEY

# 3. Deploy TimeToken
forge create src/TimeToken.sol:TimeToken \
  --rpc-url https://rpc.worldchain.org \
  --private-key $PRIVATE_KEY

# 4. Deploy HumanBond (necesita las direcciones anteriores)
forge create src/HumanBond.sol:HumanBond \
  --rpc-url https://rpc.worldchain.org \
  --private-key $PRIVATE_KEY \
  --constructor-args \
    0x17B354dD2595411ff79041f930e491A4Df39A278 \
    <VOW_NFT_ADDRESS> \
    <TIME_TOKEN_ADDRESS> \
    <MILESTONE_NFT_ADDRESS> \
    <EXTERNAL_NULLIFIER_PROPOSE> \
    <EXTERNAL_NULLIFIER_ACCEPT>
```

## Información de Deployment

### Contratos a Desplegar:
1. **VowNFT**: NFT soulbound que representa el vínculo matrimonial
2. **MilestoneNFT**: NFTs de aniversario (1, 2, 3, 4 años)
3. **TimeToken**: Token ERC20 "TIME" que se genera diariamente
4. **HumanBond**: Contrato principal que gestiona las propuestas y matrimonios

### Configuración World ID:
- **Router Address**: `0x17B354dD2595411ff79041f930e491A4Df39A278`
- **Group ID**: 1 (hardcoded en el contrato)
- **External Nullifiers**: Se generan en el script de deployment

### IPFS URIs para Milestone NFTs:
- Year 1: `ipfs://QmPAVmWBuJnNgrGrAp34CqTa13VfKkEZkZak8d6E4MJio8`
- Year 2: `ipfs://QmPTuKXg64EaeyreUFe4PJ1istspMd4G2oe2ArRYrtBGYn`
- Year 3: `ipfs://Qma32oBrwNNQVR3KS14RHqt3QhgYMsGKabQv4jusdtgsKN`
- Year 4: `ipfs://QmSw9ixqCVc7VPQzDdX1ZCdWWJwAfLHRdJsi831PsC94uh`

## Paso 4: Después del Deployment

Una vez desplegado, guarda las direcciones de los contratos en un archivo para referencia:

```bash
# Las direcciones se guardarán automáticamente en:
# broadcast/Deploy.s.sol/480/run-latest.json
```

## Verificación del Deployment

Verifica que todos los contratos se hayan desplegado correctamente:

```bash
# Verificar que HumanBond tenga el World ID Router correcto
cast call <HUMAN_BOND_ADDRESS> "worldId()(address)" --rpc-url https://rpc.worldchain.org

# Verificar que VowNFT esté linkeado correctamente
cast call <HUMAN_BOND_ADDRESS> "vowNFT()(address)" --rpc-url https://rpc.worldchain.org
```

## Recursos

- **World Chain Mainnet RPC**: https://rpc.worldchain.org
- **Chain ID**: 480
- **Explorer**: https://worldscan.org (si existe)
- **Documentación World ID**: https://docs.world.org/world-id
- **Documentación World Chain**: https://docs.world.org/world-chain

## Notas Importantes

⚠️ **Seguridad**:
- Nunca compartas tu private key
- Usa un hardware wallet para mainnet si es posible
- Verifica todas las direcciones antes de hacer transacciones

📝 **Gas Costs**:
- Ten suficiente ETH para cubrir el deployment completo
- Estima ~0.05-0.1 ETH para todo el deployment (varía según el gas price)

🔍 **Testing**:
- Se recomienda probar primero en una testnet (World Chain Sepolia)
- Verifica todos los contratos después del deployment

