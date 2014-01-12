<div class="alert alert-danger">DANGER! This low level operation!</div>

<table class="table calibration">
    <thead>
    <tr>
        <th>#</th>
        <th>min</th>
        <th>max</th>
    </tr>
    </thead>
    <tbody>
    {% for slider in data %}
        <tr>
            <td>{{ slider.name }}</td>
            <td><input data-name="{{ loop.key }}" data-type="min" value="{{ slider.min }}" type="text"></td>
            <td><input data-name="{{ loop.key }}" data-type="max" value="{{ slider.max }}" type="text"></td>
        </tr>
    {% endfor %}
    </tbody>
</table>

<button type="button" onclick="window.calibration.send()" class="btn btn-success">Save calibration</button>