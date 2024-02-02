import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import odeint

# Define the system of differential equations with time dependency
def system(y, t):
    # y is a vector; y[0] is x, y[1] is y
    x, y = y

    # Example: differential equations with time-dependency
    # dx/dt = f(x, y, t)
    # dy/dt = g(x, y, t)
    dxdt = np.sin(t) - x*y
    dydt = np.cos(t) - x*y

    return [dxdt, dydt]

# Create a grid and compute direction at each point
Y, X = np.mgrid[-3:3:100j, -3:3:100j]
U, V = np.zeros(Y.shape), np.zeros(X.shape)
T = 0  # The time 'T' at which to evaluate the direction fields

for i in range(X.shape[0]):
    for j in range(Y.shape[1]):
        x = X[i, j]
        y = Y[i, j]
        dxdt, dydt = system([x, y], T)
        U[i,j] = dxdt
        V[i,j] = dydt

# Normalize the arrows
N = np.sqrt(U**2 + V**2)
U = U/N
V = V/N

# Create the figure and plot the phase plane
plt.figure(figsize=(8, 6))
plt.quiver(X, Y, U, V, color='r')
plt.xlabel('x')
plt.ylabel('y')
plt.title(f'Phase Plane Plot at t={T}')
plt.xlim([-3, 3])
plt.ylim([-3, 3])
plt.grid()

# Plot trajectories for different starting points and times
for y0 in [0.5, 1.0, 1.5, 2.0]:
    tspan = np.linspace(0, 10, 1000)  # time span for the ODE solver
    y_initial = [y0, y0]
    ys = odeint(system, y_initial, tspan)

    plt.plot(ys[:,0], ys[:,1], 'b')  # path line
    plt.plot([ys[0,0]], [ys[0,1]], 'o') # start point
    plt.plot([ys[-1,0]], [ys[-1,1]], 's') # end point

# Show the plot
plt.show()
