const t = require('tap')
const { load: loadMockNpm } = require('../../fixtures/mock-npm.js')
const MockRegistry = require('../../fixtures/mock-registry.js')

const npa = require('npm-package-arg')
const packageName = '@npmcli/test-package'
const spec = npa(packageName)
const auth = { '//registry.npmjs.org/:_authToken': 'test-auth-token' }

const maintainers = [
  { email: 'test-user-a@npmjs.org', name: 'test-user-a' },
  { email: 'test-user-b@npmjs.org', name: 'test-user-b' },
]

t.test('owner no args', async t => {
  const { npm } = await loadMockNpm(t)
  await t.rejects(
    npm.exec('owner', []),
    { code: 'EUSAGE' },
    'rejects with usage'
  )
})

t.test('owner ls no args', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    prefixDir: {
      'package.json': JSON.stringify({ name: packageName }),
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })

  const manifest = registry.manifest({
    name: packageName,
    packuments: [{ maintainers, version: '1.0.0' }],
  })
  registry.package({ manifest })

  await npm.exec('owner', ['ls'])
  t.match(joinedOutput(), maintainers.map(m => `${m.name} <${m.email}>`).join('\n'))
})

t.test('local package.json has no name', async t => {
  const { npm } = await loadMockNpm(t, {
    prefixDir: {
      'package.json': JSON.stringify({ hello: 'world' }),
    },
  })
  await t.rejects(
    npm.exec('owner', ['ls']),
    { code: 'EUSAGE' }
  )
})

t.test('owner ls global', async t => {
  const { npm } = await loadMockNpm(t, {
    config: { global: true },
  })

  await t.rejects(
    npm.exec('owner', ['ls']),
    { code: 'EUSAGE' },
    'rejects with usage'
  )
})

t.test('owner ls no args no cwd package', async t => {
  const { npm } = await loadMockNpm(t)

  await t.rejects(
    npm.exec('owner', ['ls'])
  )
})

t.test('owner ls fails to retrieve packument', async t => {
  const { npm, logs } = await loadMockNpm(t, {
    prefixDir: {
      'package.json': JSON.stringify({ name: packageName }),
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  registry.nock.get(`/${spec.escapedName}`).reply(404)
  await t.rejects(npm.exec('owner', ['ls']))
  t.match(logs.error, [['owner ls', "Couldn't get owner data", '@npmcli/test-package']])
})

t.test('owner ls <pkg>', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t)
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })

  const manifest = registry.manifest({
    name: packageName,
    packuments: [{ maintainers, version: '1.0.0' }],
  })
  registry.package({ manifest })

  await npm.exec('owner', ['ls', packageName])
  t.match(joinedOutput(), maintainers.map(m => `${m.name} <${m.email}>`).join('\n'))
})

t.test('owner ls <pkg> no maintainers', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t)
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  const manifest = registry.manifest({
    name: packageName,
    versions: ['1.0.0'],
  })
  registry.package({ manifest })

  await npm.exec('owner', ['ls', packageName])
  t.equal(joinedOutput(), 'no admin found')
})

t.test('owner add <user> <pkg>', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: { ...auth },
  })
  const username = 'foo'
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  const manifest = registry.manifest({
    name: packageName,
    packuments: [{ maintainers, version: '1.0.0' }],
  })
  registry.couchuser({ username })
  registry.package({ manifest })
  registry.nock.put(`/${spec.escapedName}/-rev/${manifest._rev}`, body => {
    t.match(body, {
      _id: manifest._id,
      _rev: manifest._rev,
      maintainers: [
        ...manifest.maintainers,
        { name: username, email: '' },
      ],
    })
    return true
  }).reply(200, {})
  await npm.exec('owner', ['add', username, packageName])
  t.equal(joinedOutput(), `+ ${username} (${packageName})`)
})

t.test('owner add <user> cwd package', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    prefixDir: {
      'package.json': JSON.stringify({ name: packageName }),
    },
    config: { ...auth },
  })
  const username = 'foo'
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  const manifest = registry.manifest({
    name: packageName,
    packuments: [{ maintainers, version: '1.0.0' }],
  })
  registry.couchuser({ username })
  registry.package({ manifest })
  registry.nock.put(`/${spec.escapedName}/-rev/${manifest._rev}`, body => {
    t.match(body, {
      _id: manifest._id,
      _rev: manifest._rev,
      maintainers: [
        ...manifest.maintainers,
        { name: username, email: '' },
      ],
    })
    return true
  }).reply(200, {})
  await npm.exec('owner', ['add', username])
  t.equal(joinedOutput(), `+ ${username} (${packageName})`)
})

t.test('owner add <user> <pkg> already an owner', async t => {
  const { npm, joinedOutput, logs } = await loadMockNpm(t, {
    config: { ...auth },
  })
  const username = maintainers[0].name
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  const manifest = registry.manifest({
    name: packageName,
    packuments: [{ maintainers, version: '1.0.0' }],
  })
  registry.couchuser({ username })
  registry.package({ manifest })
  await npm.exec('owner', ['add', username, packageName])
  t.equal(joinedOutput(), '')
  t.match(
    logs.info,
    [['owner add', 'Already a package owner: test-user-a <test-user-a@npmjs.org>']]
  )
})

t.test('owner add <user> <pkg> fails to retrieve user', async t => {
  const { npm, logs } = await loadMockNpm(t, {
    config: { ...auth },
  })
  const username = 'foo'
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  registry.couchuser({ username, responseCode: 404, body: {} })
  await t.rejects(npm.exec('owner', ['add', username, packageName]))
  t.match(logs.error, [['owner mutate', `Error getting user data for ${username}`]])
})

t.test('owner add <user> <pkg> fails to PUT updates', async t => {
  const { npm } = await loadMockNpm(t, {
    config: { ...auth },
  })
  const username = 'foo'
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  const manifest = registry.manifest({
    name: packageName,
    packuments: [{ maintainers, version: '1.0.0' }],
  })
  registry.couchuser({ username })
  registry.package({ manifest })
  registry.nock.put(`/${spec.escapedName}/-rev/${manifest._rev}`).reply(404, {})
  await t.rejects(
    npm.exec('owner', ['add', username, packageName]),
    { code: 'EOWNERMUTATE' }
  )
})

t.test('owner add <user> <pkg> no previous maintainers property from server', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: { ...auth },
  })
  const username = 'foo'
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  const manifest = registry.manifest({
    name: packageName,
    packuments: [{ maintainers: undefined, version: '1.0.0' }],
  })
  registry.couchuser({ username })
  registry.package({ manifest })
  registry.nock.put(`/${spec.escapedName}/-rev/${manifest._rev}`, body => {
    t.match(body, {
      _id: manifest._id,
      _rev: manifest._rev,
      maintainers: [{ name: username, email: '' }],
    })
    return true
  }).reply(200, {})
  await npm.exec('owner', ['add', username, packageName])
  t.equal(joinedOutput(), `+ ${username} (${packageName})`)
})

t.test('owner add no user', async t => {
  const { npm } = await loadMockNpm(t)

  await t.rejects(
    npm.exec('owner', ['add']),
    { code: 'EUSAGE' }
  )
})

t.test('owner add <user> no pkg global', async t => {
  const { npm } = await loadMockNpm(t, {
    config: { global: true },
  })

  await t.rejects(
    npm.exec('owner', ['add', 'foo']),
    { code: 'EUSAGE' }
  )
})

t.test('owner add <user> no cwd package', async t => {
  const { npm } = await loadMockNpm(t)

  await t.rejects(
    npm.exec('owner', ['add', 'foo']),
    { code: 'EUSAGE' }
  )
})

t.test('owner rm <user> <pkg>', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: { ...auth },
  })
  const username = maintainers[0].name
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  const manifest = registry.manifest({
    name: packageName,
    packuments: [{ maintainers, version: '1.0.0' }],
  })
  registry.couchuser({ username })
  registry.package({ manifest })
  registry.nock.put(`/${spec.escapedName}/-rev/${manifest._rev}`, body => {
    t.match(body, {
      _id: manifest._id,
      _rev: manifest._rev,
      maintainers: maintainers.slice(1),
    })
    return true
  }).reply(200, {})
  await npm.exec('owner', ['rm', username, packageName])
  t.equal(joinedOutput(), `- ${username} (${packageName})`)
})

t.test('owner rm <user> <pkg> not a current owner', async t => {
  const { npm, logs } = await loadMockNpm(t, {
    config: { ...auth },
  })
  const username = 'foo'
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  const manifest = registry.manifest({
    name: packageName,
    packuments: [{ maintainers, version: '1.0.0' }],
  })
  registry.couchuser({ username })
  registry.package({ manifest })
  await npm.exec('owner', ['rm', username, packageName])
  t.match(logs.info, [['owner rm', `Not a package owner: ${username}`]])
})

t.test('owner rm <user> cwd package', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    prefixDir: {
      'package.json': JSON.stringify({ name: packageName }),
    },
    config: { ...auth },
  })
  const username = maintainers[0].name
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  const manifest = registry.manifest({
    name: packageName,
    packuments: [{ maintainers, version: '1.0.0' }],
  })
  registry.couchuser({ username })
  registry.package({ manifest })
  registry.nock.put(`/${spec.escapedName}/-rev/${manifest._rev}`, body => {
    t.match(body, {
      _id: manifest._id,
      _rev: manifest._rev,
      maintainers: maintainers.slice(1),
    })
    return true
  }).reply(200, {})
  await npm.exec('owner', ['rm', username])
  t.equal(joinedOutput(), `- ${username} (${packageName})`)
})

t.test('owner rm <user> only user', async t => {
  const { npm } = await loadMockNpm(t, {
    prefixDir: {
      'package.json': JSON.stringify({ name: packageName }),
    },
    config: { ...auth },
  })
  const username = maintainers[0].name
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  const manifest = registry.manifest({
    name: packageName,
    packuments: [{ maintainers: maintainers.slice(0, 1), version: '1.0.0' }],
  })
  registry.couchuser({ username })
  registry.package({ manifest })
  await t.rejects(
    npm.exec('owner', ['rm', username]),
    {
      code: 'EOWNERRM',
      message: 'Cannot remove all owners of a package. Add someone else first.',
    }
  )
})

t.test('owner rm no user', async t => {
  const { npm } = await loadMockNpm(t)
  await t.rejects(
    npm.exec('owner', ['rm']),
    { code: 'EUSAGE' }
  )
})

t.test('owner rm no pkg global', async t => {
  const { npm } = await loadMockNpm(t, {
    config: { global: true },
  })
  await t.rejects(
    npm.exec('owner', ['rm', 'foo']),
    { code: 'EUSAGE' }
  )
})

t.test('owner rm <user> no cwd package', async t => {
  const { npm } = await loadMockNpm(t)
  await t.rejects(
    npm.exec('owner', ['rm', 'foo']),
    { code: 'EUSAGE' }
  )
})

t.test('completion', async t => {
  t.test('basic commands', async t => {
    const { npm } = await loadMockNpm(t)
    const owner = await npm.cmd('owner')
    const testComp = async (argv, expect) => {
      const res = await owner.completion({ conf: { argv: { remain: argv } } })
      t.strictSame(res, expect, argv.join(' '))
    }

    await Promise.all([
      testComp(['npm', 'foo'], []),
      testComp(['npm', 'owner'], ['add', 'rm', 'ls']),
      testComp(['npm', 'owner', 'add'], []),
      testComp(['npm', 'owner', 'ls'], []),
      testComp(['npm', 'owner', 'rm', 'foo'], []),
    ])
  })

  t.test('completion npm owner rm', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: { 'package.json': JSON.stringify({ name: packageName }) },
    })
    const owner = await npm.cmd('owner')
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })
    const manifest = registry.manifest({
      name: packageName,
      packuments: [{ maintainers, version: '1.0.0' }],
    })
    registry.package({ manifest })
    const res = await owner.completion({ conf: { argv: { remain: ['npm', 'owner', 'rm'] } } })
    t.strictSame(res, maintainers.map(m => m.name), 'should return list of current owners')
  })

  t.test('completion npm owner rm no cwd package', async t => {
    const { npm } = await loadMockNpm(t)
    const owner = await npm.cmd('owner')
    const res = await owner.completion({ conf: { argv: { remain: ['npm', 'owner', 'rm'] } } })
    t.strictSame(res, [], 'should have no owners to autocomplete if not cwd package')
  })

  t.test('completion npm owner rm global', async t => {
    const { npm } = await loadMockNpm(t, {
      config: { global: true },
    })
    const owner = await npm.cmd('owner')
    const res = await owner.completion({ conf: { argv: { remain: ['npm', 'owner', 'rm'] } } })
    t.strictSame(res, [], 'should have no owners to autocomplete if global')
  })

  t.test('completion npm owner rm no owners found', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: { 'package.json': JSON.stringify({ name: packageName }) },
    })
    const owner = await npm.cmd('owner')
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })
    const manifest = registry.manifest({
      name: packageName,
      packuments: [{ maintainers: [], version: '1.0.0' }],
    })
    registry.package({ manifest })

    const res = await owner.completion({ conf: { argv: { remain: ['npm', 'owner', 'rm'] } } })
    t.strictSame(res, [], 'should return no owners if not found')
  })
})