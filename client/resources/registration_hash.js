user_registration = {
    first_first_name: '',
    second_first_name: '',
    first_last_name: '',
    second_last_name: '',
    email: '',
    phone: '',
    id_type: 'cc,pasaporte',
    id_numeber: '',
    id_expedition_city: 'Ciudades colombia',
    id_expedition_date: 'date',
    genero: 'masculino, femenino',
    resident_department: 'Departamentos colombia',
    resident_city: 'ciudades departamento',
    direccion: '',
    //Lawyer
    lawyer_id: '',
    experience_years: 'num',
    univercity_name: '',
    univercity_title: '',
    study_level: 'pregrado, diplomado, especializacion, maestria, doctorado'
}

<form name="form_constraints" class="form-validation" novalidate data-ng-submit="submitForm()">
                    <div class="form-group">
                        <label for="">Required</label>
                        <input type="text"
                               class="form-control"
                               required
                               data-ng-model="form.required_input"
                        >
                        <br>
                        <textarea class="form-control"
                                  rows="10"
                                  required
                                  data-ng-model="form.required_textarea"></textarea>
                        <br>
                        <input  type="checkbox"
                                id="required_checkbox"
                                required
                                data-ng-model="form.required_checkbox"> 
                        <label for="required_checkbox">You need to agree to the Policy</label>
                    </div>
                    <div class="form-group">
                        <label for="">Min length 3 </label>
                        <input  type="text"
                                class="form-control"
                                required
                                data-ng-minlength=3
                                data-ng-model="form.minlength"
                        >
                        <span></span>
                    </div>
                    <div class="form-group">
                        <label for="">Max length 10</label>
                        <input  type="text"
                                class="form-control"
                                required
                                data-ng-maxlength=10
                                data-ng-model="form.maxlength"
                        >
                        <span></span>
                    </div>
                    <div class="form-group">
                        <label for="">Length from 3 to 10</label>
                        <input  type="text"
                                class="form-control"
                                required
                                data-ng-minlength=3
                                data-ng-maxlength=10
                                data-ng-model="form.length_rage"
                        >
                        <span></span>
                    </div>
                    <div class="form-group">
                        <div class="row">
                            <div class="col-md-6">
                                <label for="">Type something</label>
                                <input  type="text"
                                        class="form-control"
                                        required
                                        name="type_something"
                                        data-ng-trim='false'
                                        data-ng-model="form.type_something"
                                >                        
                                <span></span>
                            </div>
                            <div class="col-md-6">
                                <label for="">Confirm type</label>
                                <input  type="text"
                                        class="form-control"
                                        required
                                        name="confirm_type"
                                        data-ng-trim='false'
                                        data-ng-model="form.confirm_type"
                                        data-match="form.type_something"
                                >                        
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="">Equal to "foo"</label>
                        <input  type="text"
                                class="form-control"
                                required
                                data-ng-model="form.foo"
                                data-ng-pattern="/^foo$/"
                        >
                        <span></span>
                    </div>
                    <div class="form-group">
                        <label for="">Email</label>
                        <input    type="email"
                                class="form-control"
                                required
                                data-ng-model="form.email"
                        >
                        <span></span>
                    </div>
                    <div class="form-group">
                        <label for="">Url</label>
                        <input  type="url"
                                class="form-control"
                                required
                                data-ng-model="form.url"
                        >
                        <span></span>
                    </div>
                    <div class="form-group">
                        <label for="">Must be a number</label>
                        <input  type="number"
                                class="form-control"
                                required
                                name="form.num"
                                data-ng-model="form.num"
                        >
                        <span></span>
                    </div>
                    <div class="form-group">
                        <label for="">Number min value 3 </label>
                        <input  type="number"
                                class="form-control"
                                required
                                data-min=3
                                data-ng-model="form.minVal"
                        >
                        <span></span>
                    </div>
                    <div class="form-group">
                        <label for="">Number max value 20</label>
                        <input  type="number"
                                class="form-control"
                                required
                                data-max=20
                                data-ng-model="form.maxVal"
                        >
                        <span></span>
                    </div>
                    <div class="form-group">
                        <label for="">Number value between 3 and 20</label>
                        <input  type="number"
                                class="form-control"
                                required
                                data-min=3
                                data-max=20
                                data-ng-model="form.valRange"
                        >
                        <span></span>
                    </div>
                    <div class="form-group">
                        <label for="">Match a pattern, e.g. hex color code</label>
                        <input  type="text"
                                class="form-control"
                                placeholder="Hex color code here, like #e5e5e5, or #fff"
                                required
                                data-ng-pattern="/^#(?:[0-9a-fA-F]{3}){1,2}$/"
                                data-ng-model="form.pattern"
                        >
                        <span></span>
                    </div>

                    <button type="submit"
                            ui-wave
                            class="btn btn-primary btn-w-md"
                            data-ng-disabled="!canSubmit()"
                            >Submit</button>
                    <button class="btn btn-default btn-w-md"
                            ui-wave
                            data-ng-disabled="!canRevert()"
                            data-ng-click="revert()"
                    >Revert Changes</button>
                    <div class="callout callout-info">
                        <p>Submit button will be active only when all fields are valid.</p>
                        <p>Revert button will be active only when one or more fields is changed.</p>
                    </div>
                    <div class="alert alert-info" data-ng-show="showInfoOnSubmit">Congrats! You have successfully submited the form :)</div>                 
                </form>