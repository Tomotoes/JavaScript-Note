const source = [1, 2, 3, 4]

const arrayProto = Array.prototype

const arrayProxy = Object.create(arrayProto)

const hasProto = '__proto__' in {}

const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse']

methodsToPatch.forEach(function(method) {
	const original = arrayProto[method]
	def(arrayProxy, method, function(...args) {
		const result = original.apply(this, args)

		let inserted

		switch (method) {
			case 'push':
			case 'unshift':
				inserted = args
				break
			case 'splice':
				insert = args.splice(2)
				break
		}

		console.log(`增加的元素:${inserted}`)
		return result
	})
})

const arrayKeys = Object.getOwnPropertyNames(arrayProxy)

if (hasProto) {
	source.__proto__ = arrayProxy
} else {
	copyProperties(source, arrayProxy, arrayKeys)
}

function copyProperties(target, src, keys) {
	for (const key of keys) {
		def(target, key, src[key])
	}
}

function def(obj, key, val, enumerable) {
	Object.defineProperty(obj, key, {
		value: val,
		enumerable: !!enumerable,
		writable: true,
		configurable: true
	})
}

source.push(...[5,6])
source.unshift(7)

console.log(source)