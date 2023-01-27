import sys
import sympy

n = 9

x, y, t = sympy.symbols('x y t')

print(f"====== Calculating functions till n = {n} ======")
print(f"Step 1: Calculating the first {2 * n} derivatives to do so")

derivatives = [
    sympy.sympify('sqrt(y * t^3 + x * t^2 + t + 1)')
]

factors = [
    0
]

i_offset = 0
try:
    cache_file = open("function_cache.txt", "r")
    lines = cache_file.readlines()
    for line in lines:
        parts = line.split('\t')
        # currently not loading derivatives, since it caused the program to crash
        # derivatives.append(sympy.sympify(parts[0]))
        factors.append(sympy.sympify(parts[1]))
        i_offset += 1

    cache_file.close()

    print(f"{i_offset} derivatives have been read from cache and don't need to be calculated.")
except FileNotFoundError:
    print("No cache file found.")

cache_file = open("function_cache.txt", "a")
try:
    for i in range(i_offset, 2 * n):
        derivatives.append(sympy.diff(derivatives[i], t))
        factors.append(derivatives[i + 1].subs(t, 0) * sympy.sympify(f'1/{i + 1}!'))
        sys.stdout.write("\rCalculated derivative " + str(i + 1) + " of " + str(2 * n))
        sys.stdout.flush()
        cache_file.write(f"{derivatives[i + 1]}\t{factors[i + 1]}\n")
except KeyboardInterrupt:
    cache_file.close()
    print("Calculation has been stopped prematurely.")
    exit(1)
cache_file.close()

print("Step 2: Calculating functions")
results_file = open("results.txt", "w")
for i in range(3, n + 1):
    M = 0
    if i % 2 == 0:
        p = int(i / 2)
        M = sympy.Matrix.zeros(p - 1, p - 1)
        for u in range(0, 2 * p - 3):
            for v in range(0, u + 1):
                if v < p - 1 and u - v < p - 1:
                    M[v, u - v] = factors[u + 3]
        result = M.det()
        print(f"n = {i}: {result}")
        results_file.write(f"{result}\n")
    else:
        p = int((i - 1) / 2)
        M = sympy.Matrix.zeros(p, p)
        for u in range(0, 2 * p - 1):
            for v in range(0, u + 1):
                if v < p and u - v < p:
                    M[v, u - v] = factors[u + 2]
        result = M.det()
        print(f"n = {i}: {result}")
        results_file.write(f"{result}\n")
results_file.close()
