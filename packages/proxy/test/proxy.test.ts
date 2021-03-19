// import { proxy } from '../src';
// import type { Transaction } from '../src/transaction';
// import { appmap } from './contracts/appmap/abi';
// import { AppMapContract } from './contracts/appmap/interface';
import { createClarityBin } from '../src/providers/test-provider/utils';
import { TestProvider } from '../src/providers/test-provider';
// import { principalToString } from '../src/providers/test-provider/utils';
// import { ClarityType, PrincipalCV } from '@stacks/transactions';
import { simpleContract as simpleProxy } from './contracts/simple';

const getContract = async () => {
  const clarityBin = await createClarityBin();
  const provider = await TestProvider.create({
    contractFilePath: 'test/contracts/simple/simple.clar',
    contractIdentifier: 'S1G2081040G2081040G2081040G208105NK8PE5.simple',
    clarityBin,
  });
  const contract = simpleProxy(provider);
  return contract;
};

test('can call public function', async () => {
  const contract = await getContract();
  const tx = contract.getName();
  const receipt = await tx.submit({ sender: 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW' });
  const result = await receipt.getResult();
  if (!result.isOk) throw 'Expected ok';
  expect(result.value.data).toEqual('hello, world');
});

test('can call a read-only function', async () => {
  const contract = await getContract();
  const num = await contract.getNumber();
  expect(num.value.toNumber()).toEqual(1);
});
