# Differential Equation Grapher

The substantial logic that might be most interesting is in [`app/Http/Controllers/Graph.php`](https://github.com/benborgers/diff-eq-grapher/blob/main/app/Http/Controllers/Graph.php).

## Deployment

Set up the Python aspect of the server like this:

Make a folder `resources/python` and `cd` into it.

```bash
cd resources/python
python3 -m venv venv
source venv/bin/activate
pip install numpy scipy matplotlib sympy
```
