import sys
import json
from sympy import symbols, lambdify, E
from sympy.parsing.sympy_parser import parse_expr
import numpy as np
from scipy.integrate import odeint
import matplotlib.pyplot as plt

payload = json.loads(sys.argv[1])

t = np.linspace(0, float(payload['timeMax']), 400)

y_symbol, t_symbol = symbols('y t')

for equation in payload['equations']:
  # Usually the mathematical constant e has to be written as E, but use allow_dict to recognize e as well.
  clean_expr = parse_expr(equation['value'], local_dict={'e': E}, transformations='all')
  func = lambdify((y_symbol, t_symbol), clean_expr, 'numpy')
  initial_condition = float(equation['initialCondition'])
  solution = odeint(func, initial_condition, t)
  plt.plot(t, solution, label=equation['value'])

plt.xlabel('Time')
plt.ylabel('y(t)')
plt.legend()

plt.savefig(payload['destination'], dpi=300)
