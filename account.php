<?php
require 'components/header.php';
require_once 'utils/Database.php';
require_once 'utils/Log.php';
$config = require 'config.php';
Database::connect($config);
?>

<div class="container mt-4">
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0"><i class="bi bi-person-lines-fill me-2"></i>Il Tuo Account</h4>
                </div>
                <div class="card-body">
                    <?php
                    // Recupera i dati dell'utente loggato
                    $id = $_SESSION['id'] ?? -1;
                    $user_data = null;
                    try {
                        $user_data = Database::select('select *, r.ruolo as nomeruolo from utenti u
                        inner join ruoli r on r.id = u.ruolo where u.id = :id;', [':id' => $id]);
                    } catch (Exception $e) {
                        Log::errlog($e);
                    }
                    if (!empty($user_data)) {
                        $user = $user_data[0];
                        ?>

                        <ul class="nav nav-tabs" id="accountTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="info-tab" data-bs-toggle="tab"
                                        data-bs-target="#info" type="button" role="tab" aria-controls="info"
                                        aria-selected="true">
                                    <i class="bi bi-info-circle me-1"></i>Informazioni
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="edit-tab" data-bs-toggle="tab" data-bs-target="#edit"
                                        type="button" role="tab" aria-controls="edit" aria-selected="false">
                                    <i class="bi bi-pencil-square me-1"></i>Modifica
                                </button>
                            </li>
                        </ul>

                        <div class="tab-content p-3 border border-top-0 rounded-bottom" id="accountTabsContent">
                            <!-- Tab Visualizzazione Informazioni -->
                            <div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                                <div class="row">
                                    <div class="col-md-8">
                                        <table class="table table-hover">
                                            <tr>
                                                <th width="30%"><i class="bi bi-person me-2"></i>Nome:</th>
                                                <td><?= $user->nome ?></td>
                                            </tr>
                                            <tr>
                                                <th><i class="bi bi-person me-2"></i>Cognome:</th>
                                                <td><?= $user->cognome ?></td>
                                            </tr>
                                            <tr>
                                                <th><i class="bi bi-envelope me-2"></i>Email:</th>
                                                <td><?= $user->email ?></td>
                                            </tr>
                                            <tr>
                                                <th><i class="bi bi-briefcase me-2"></i>Ruolo:</th>
                                                <td><?= $user->nomeruolo ?></td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div class="col-md-4 text-center">
                                        <div class="p-3 border rounded">
                                            <i class="bi bi-person-circle text-primary" style="font-size: 6rem;"></i>
                                            <h4 class="mt-2"><?= $user->nome . ' ' . $user->cognome ?></h4>
                                            <p class="badge bg-info"><?= $user->ruolo ?></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Tab Modifica Informazioni -->
                            <div class="tab-pane fade" id="edit" role="tabpanel" aria-labelledby="edit-tab">
                                <form method="POST" action="action/edit_account.php">
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label for="nome" class="form-label">Nome</label>
                                            <input type="text" class="form-control" id="nome" name="nome"
                                                   value="<?= $user->nome ?>" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="cognome" class="form-label">Cognome</label>
                                            <input type="text" class="form-control" id="cognome" name="cognome"
                                                   value="<?= $user->cognome ?>" required>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="email" name="email"
                                               value="<?= $user->email ?>" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="ruolo" class="form-label">Ruolo</label>
                                        <input type="text" class="form-control" id="ruolo"
                                               value="<?= $user->nomeruolo ?>" readonly>
                                        <small class="form-text text-muted">Il valore può essere modificato solo
                                            dall'amministratore.</small>
                                    </div>
                                    <hr>
                                    <h5><i class="bi bi-key me-2"></i>Modifica Password</h5>
                                    <div class="mb-3">
                                        <label for="current_password" class="form-label">Password Attuale</label>
                                        <input type="password" class="form-control" id="current_password"
                                               name="current_password">
                                        <small class="form-text text-muted">Lascia vuoto se non vuoi cambiare la
                                            password.</small>
                                    </div>
                                    <div class="mb-3">
                                        <label for="new_password" class="form-label">Nuova Password</label>
                                        <input type="password" class="form-control" id="new_password"
                                               name="new_password">
                                        <small class="form-text text-muted">La password deve contenere almeno 8
                                            caratteri, di cui elmeno un numero, una lettera maiuscola, una minuscola e
                                            un carattere speciale.</small>
                                    </div>
                                    <div class="mb-3">
                                        <label for="confirm_password" class="form-label">Conferma Nuova Password</label>
                                        <input type="password" class="form-control" id="confirm_password"
                                               name="confirm_password">
                                    </div>

                                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="bi bi-save me-1"></i>Salva Modifiche
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <?php
                    } else {
                        echo '<div class="alert alert-danger">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>Devi prima effettuare il login!
                              </div>';
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    // Validazione per la conferma della password
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.querySelector('form');
        const newPassword = document.getElementById('new_password');
        const confirmPassword = document.getElementById('confirm_password');

        form.addEventListener('submit', function (event) {
            if (newPassword.value && newPassword.value !== confirmPassword.value) {
                event.preventDefault();
                alert('Le password non coincidono!');
                confirmPassword.focus();
            }
        });
    });
</script>

<?php require 'components/footer.php'; ?>
